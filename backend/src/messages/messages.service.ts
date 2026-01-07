import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Inject } from '@nestjs/common';
import { JobQueueService as IJobQueueService } from '../jobs/job-queue.interface';
import { MessageAudience, MessageDeliveryStatus } from '@prisma/client';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    @Inject('JobQueueService') private jobQueue: IJobQueueService,
  ) {
    // Register job handler for scheduled messages
    this.jobQueue.process('messages.send', async (job) => {
      await this.sendScheduledMessage(job.data.messageId);
    });
  }

  async createMessage(projectId: string, userId: string, dto: CreateMessageDto) {
    // Verify user is committee or admin
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId,
        userId,
      },
      include: { role: true },
    });

    if (!membership || (membership.role.name !== 'committee' && membership.role.name !== 'admin_root')) {
      throw new ForbiddenException('Only committee can create messages');
    }

    const scheduledAt = dto.scheduledAt ? new Date(dto.scheduledAt) : null;
    const now = new Date();

    // Validate scheduledAt is in the future if provided
    if (scheduledAt && scheduledAt <= now) {
      throw new BadRequestException('scheduledAt must be in the future');
    }

    const message = await this.prisma.message.create({
      data: {
        projectId,
        title: dto.title,
        body: dto.body,
        audienceFilter: dto.audienceFilter,
        scheduledAt,
        sentAt: scheduledAt ? null : now, // Send immediately if not scheduled
        createdByUserId: userId,
      },
    });

    // If not scheduled, send immediately
    if (!scheduledAt) {
      await this.sendMessageNow(message.id, userId);
    } else {
      // Schedule job for future sending
      const delay = scheduledAt.getTime() - now.getTime();
      if (delay > 0) {
        await this.jobQueue.add(
          'messages.send',
          { messageId: message.id },
          { delay, attempts: 3 },
        );
      }
    }

    await this.auditService.log({
      actorUserId: userId,
      projectId,
      actionKey: scheduledAt ? 'messages.scheduled' : 'messages.created',
      targetType: 'Message',
      targetId: message.id,
      metadata: { title: message.title, scheduledAt: message.scheduledAt },
    });

    return message;
  }

  async sendMessageNow(messageId: string, actorUserId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verify access
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId: message.projectId,
        userId: actorUserId,
      },
      include: { role: true },
    });

    if (!membership || (membership.role.name !== 'committee' && membership.role.name !== 'admin_root')) {
      throw new ForbiddenException('Only committee can send messages');
    }

    if (message.sentAt) {
      // Already sent, return existing
      return message;
    }

    // Get eligible recipients based on audience filter
    const recipients = await this.getEligibleRecipients(message.projectId, message.audienceFilter);

    // Create deliveries for all recipients
    const deliveries = await Promise.all(
      recipients.map((userId) =>
        this.prisma.messageDelivery.create({
          data: {
            projectId: message.projectId,
            messageId: message.id,
            recipientUserId: userId,
            status: MessageDeliveryStatus.UNREAD,
            deliveredAt: new Date(),
          },
        }),
      ),
    );

    // Mark message as sent
    const updated = await this.prisma.message.update({
      where: { id: messageId },
      data: { sentAt: new Date() },
    });

    await this.auditService.log({
      actorUserId,
      projectId: message.projectId,
      actionKey: 'messages.sent',
      targetType: 'Message',
      targetId: messageId,
      metadata: { recipientCount: deliveries.length },
    });

    return { ...updated, deliveryCount: deliveries.length };
  }

  async scheduleMessage(messageId: string, scheduledAt: Date, actorUserId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verify access
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId: message.projectId,
        userId: actorUserId,
      },
      include: { role: true },
    });

    if (!membership || (membership.role.name !== 'committee' && membership.role.name !== 'admin_root')) {
      throw new ForbiddenException('Only committee can schedule messages');
    }

    if (message.sentAt) {
      throw new BadRequestException('Cannot schedule an already sent message');
    }

    const now = new Date();
    if (scheduledAt <= now) {
      throw new BadRequestException('scheduledAt must be in the future');
    }

    const updated = await this.prisma.message.update({
      where: { id: messageId },
      data: { scheduledAt },
    });

    // Schedule job
    const delay = scheduledAt.getTime() - now.getTime();
    await this.jobQueue.add(
      'messages.send',
      { messageId },
      { delay, attempts: 3 },
    );

    await this.auditService.log({
      actorUserId,
      projectId: message.projectId,
      actionKey: 'messages.scheduled',
      targetType: 'Message',
      targetId: messageId,
      metadata: { scheduledAt },
    });

    return updated;
  }

  async cancelScheduledMessage(messageId: string, actorUserId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verify access
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId: message.projectId,
        userId: actorUserId,
      },
      include: { role: true },
    });

    if (!membership || (membership.role.name !== 'committee' && membership.role.name !== 'admin_root')) {
      throw new ForbiddenException('Only committee can cancel messages');
    }

    if (message.sentAt) {
      throw new BadRequestException('Cannot cancel an already sent message');
    }

    if (!message.scheduledAt) {
      throw new BadRequestException('Message is not scheduled');
    }

    // Remove scheduled job (if exists)
    // Note: In-memory queue doesn't support cancellation, but Redis/Bull will
    // For now, we just update the message

    const updated = await this.prisma.message.update({
      where: { id: messageId },
      data: { scheduledAt: null },
    });

    await this.auditService.log({
      actorUserId,
      projectId: message.projectId,
      actionKey: 'messages.cancelled',
      targetType: 'Message',
      targetId: messageId,
      metadata: { title: message.title },
    });

    return updated;
  }

  async listProjectMessages(projectId: string, userId: string) {
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId,
        userId,
      },
      include: { role: true },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this project');
    }

    const messages = await this.prisma.message.findMany({
      where: {
        projectId,
        // Only show sent messages to residents, committee/admin can see all
        ...(membership.role.name === 'resident'
          ? { sentAt: { not: null } }
          : {}),
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            deliveries: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter by audience for residents (application layer)
    if (membership.role.name === 'resident') {
      const eligibleMessageIds = await this.getEligibleMessageIds(projectId, userId, messages);
      return messages.filter((msg) => eligibleMessageIds.has(msg.id));
    }

    return messages;
  }

  async getDeliveriesSummary(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verify access (committee or admin)
    const membership = await this.prisma.projectMembership.findFirst({
      where: {
        projectId: message.projectId,
        userId,
      },
      include: { role: true },
    });

    if (!membership || (membership.role.name !== 'committee' && membership.role.name !== 'admin_root')) {
      throw new ForbiddenException('Only committee can view delivery summaries');
    }

    const [total, read, unread] = await this.prisma.$transaction([
      this.prisma.messageDelivery.count({ where: { messageId } }),
      this.prisma.messageDelivery.count({ where: { messageId, status: MessageDeliveryStatus.READ } }),
      this.prisma.messageDelivery.count({ where: { messageId, status: MessageDeliveryStatus.UNREAD } }),
    ]);

    return {
      messageId,
      total,
      read,
      unread,
      readPercent: total > 0 ? Math.round((read / total) * 100 * 100) / 100 : 0,
    };
  }

  async getMyMessages(projectId: string, userId: string) {
    const messages = await this.prisma.messageDelivery.findMany({
      where: {
        projectId,
        recipientUserId: userId,
      },
      include: {
        message: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { deliveredAt: 'desc' },
    });

    return messages.map((delivery) => ({
      id: delivery.id,
      message: {
        id: delivery.message.id,
        title: delivery.message.title,
        body: delivery.message.body,
        createdAt: delivery.message.createdAt,
        creator: delivery.message.creator,
      },
      status: delivery.status,
      readAt: delivery.readAt,
      deliveredAt: delivery.deliveredAt,
    }));
  }

  async markAsRead(deliveryId: string, userId: string) {
    const delivery = await this.prisma.messageDelivery.findUnique({
      where: { id: deliveryId },
      include: { message: true },
    });

    if (!delivery) {
      throw new NotFoundException('Message delivery not found');
    }

    if (delivery.recipientUserId !== userId) {
      throw new ForbiddenException('Cannot mark another user\'s message as read');
    }

    if (delivery.status === MessageDeliveryStatus.READ) {
      // Idempotent: already read
      return delivery;
    }

    const updated = await this.prisma.messageDelivery.update({
      where: { id: deliveryId },
      data: {
        status: MessageDeliveryStatus.READ,
        readAt: new Date(),
      },
    });

    await this.auditService.log({
      actorUserId: userId,
      projectId: delivery.projectId,
      actionKey: 'messages.read',
      targetType: 'MessageDelivery',
      targetId: deliveryId,
      metadata: { messageId: delivery.messageId },
    });

    return updated;
  }

  private async sendScheduledMessage(messageId: string): Promise<void> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.sentAt) {
      return; // Already sent or doesn't exist
    }

    // Get eligible recipients
    const recipients = await this.getEligibleRecipients(message.projectId, message.audienceFilter);

    // Create deliveries
    await Promise.all(
      recipients.map((userId) =>
        this.prisma.messageDelivery.create({
          data: {
            projectId: message.projectId,
            messageId: message.id,
            recipientUserId: userId,
            status: MessageDeliveryStatus.UNREAD,
            deliveredAt: new Date(),
          },
        }),
      ),
    );

    // Mark as sent
    await this.prisma.message.update({
      where: { id: messageId },
      data: { sentAt: new Date() },
    });
  }

  private async getEligibleRecipients(projectId: string, audienceFilter: MessageAudience): Promise<string[]> {
    if (audienceFilter === MessageAudience.COMMITTEE_ONLY) {
      const memberships = await this.prisma.projectMembership.findMany({
        where: {
          projectId,
          role: {
            name: 'committee',
          },
        },
        select: { userId: true },
      });
      return memberships.map((m) => m.userId);
    }

    if (audienceFilter === MessageAudience.UNSIGNED_RESIDENTS) {
      // TODO: Implement UNSIGNED_RESIDENTS properly based on signed document assignments
      // For now, this filter is disabled and treated as ALL_RESIDENTS
      // Feature flag: UNSIGNED_RESIDENTS_MESSAGING_ENABLED (not yet implemented)
      // When implemented, should filter residents who haven't signed required documents
      // (e.g., documents with docType = PERSONAL_CONTRACT and status = SIGNED)
      console.warn('UNSIGNED_RESIDENTS filter not yet implemented, treating as ALL_RESIDENTS');
      const memberships = await this.prisma.projectMembership.findMany({
        where: {
          projectId,
          role: {
            name: 'resident',
          },
        },
        select: { userId: true },
      });
      return memberships.map((m) => m.userId);
    }

    // ALL_RESIDENTS
    const memberships = await this.prisma.projectMembership.findMany({
      where: {
        projectId,
        role: {
          name: 'resident',
        },
      },
      select: { userId: true },
    });
    return memberships.map((m) => m.userId);
  }

  private async getEligibleMessageIds(
    projectId: string,
    userId: string,
    messages: Array<{ id: string; audienceFilter: MessageAudience }>,
  ): Promise<Set<string>> {
    const eligibleIds = new Set<string>();

    for (const msg of messages) {
      if (msg.audienceFilter === MessageAudience.COMMITTEE_ONLY) {
        continue; // Residents don't see committee-only messages
      }

      if (msg.audienceFilter === MessageAudience.UNSIGNED_RESIDENTS) {
        // TODO: Check if user has unsigned documents
        // For now, treat as ALL_RESIDENTS
        eligibleIds.add(msg.id);
        continue;
      }

      // ALL_RESIDENTS
      eligibleIds.add(msg.id);
    }

    return eligibleIds;
  }
}
