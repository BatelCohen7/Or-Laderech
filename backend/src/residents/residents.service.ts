import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ResidentsService
{
    async getOverview(userId: string)
    {
        const resident = await prisma.resident.findUnique({
            where: { userId },
            include: { project: true },
        });
        if (!resident) return { error: 'Resident not found' };

        return {
            project: resident.project,
            resident,
            stats: { documents: 0, unreadMessages: 0, activeVotes: 0 },
            recentActivity: [],
        };
    }
}
