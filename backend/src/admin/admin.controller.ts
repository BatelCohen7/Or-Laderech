import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService, CreateUserDto, UpdateUserDto, UpdateRolePermissionsDto } from './admin.service';
import { ApartmentsService, AssignUserToApartmentDto } from './apartments.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Audit } from '../common/decorators/audit.decorator';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('users.manage') // Base permission for all admin endpoints
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly apartmentsService: ApartmentsService,
  ) {}

  // Users
  @Post('users')
  @RequirePermission('users.manage')
  @UseInterceptors(AuditInterceptor)
  @Audit('users.create', 'User')
  @ApiOperation({ summary: 'Create user (admin only)' })
  async createUser(@Body() dto: CreateUserDto) {
    return this.adminService.createUser(dto);
  }

  @Get('users')
  @RequirePermission('users.manage')
  @ApiOperation({ summary: 'Get all users (admin only)' })
  async findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Put('users/:userId')
  @RequirePermission('users.manage')
  @UseInterceptors(AuditInterceptor)
  @Audit('users.update', 'User')
  @ApiOperation({ summary: 'Update user (admin only)' })
  async updateUser(@Param('userId') userId: string, @Body() dto: UpdateUserDto) {
    return this.adminService.updateUser(userId, dto);
  }

  // Roles & Permissions
  @Get('roles')
  @RequirePermission('roles.manage')
  @ApiOperation({ summary: 'Get all roles with permissions' })
  async getRoles() {
    return this.adminService.getRoles();
  }

  @Get('permissions')
  @RequirePermission('roles.manage')
  @ApiOperation({ summary: 'Get all permissions' })
  async getPermissions() {
    return this.adminService.getPermissions();
  }

  @Put('roles/:roleId/permissions')
  @RequirePermission('roles.manage')
  @UseInterceptors(AuditInterceptor)
  @Audit('roles.manage', 'RolePermission')
  @ApiOperation({ summary: 'Update role permissions (admin only)' })
  async updateRolePermissions(
    @Param('roleId') roleId: string,
    @Body() dto: Omit<UpdateRolePermissionsDto, 'roleId'>,
  ) {
    return this.adminService.updateRolePermissions({ roleId, ...dto });
  }

  // Impersonation
  @Post('impersonate/start')
  @RequirePermission('impersonate.use')
  @UseInterceptors(AuditInterceptor)
  @Audit('impersonate.start', 'ImpersonationSession')
  @ApiOperation({ summary: 'Start impersonation session (admin only)' })
  async startImpersonation(
    @CurrentUser() user: any,
    @Body('targetUserId') targetUserId: string,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.startImpersonation(user.userId, targetUserId, reason);
  }

  @Post('impersonate/:sessionId/end')
  @RequirePermission('impersonate.use')
  @UseInterceptors(AuditInterceptor)
  @Audit('impersonate.end', 'ImpersonationSession')
  @ApiOperation({ summary: 'End impersonation session (admin only)' })
  async endImpersonation(@Param('sessionId') sessionId: string) {
    return this.adminService.endImpersonation(sessionId);
  }

  @Get('impersonate/sessions')
  @RequirePermission('impersonate.use')
  @ApiOperation({ summary: 'Get impersonation sessions (admin only)' })
  async getImpersonationSessions(@CurrentUser() user: any) {
    return this.adminService.getImpersonationSessions(user.userId);
  }

  // Audit Logs
  @Get('audit')
  @RequirePermission('audit.read')
  @ApiOperation({ summary: 'Get audit logs (admin only)' })
  async getAuditLogs(
    @Query('projectId') projectId?: string,
    @Query('userId') userId?: string,
    @Query('actionKey') actionKey?: string,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAuditLogs({ projectId, userId, actionKey, limit });
  }

  // Feature Flags
  @Get('feature-flags')
  @RequirePermission('feature_flags.manage')
  @ApiOperation({ summary: 'Get feature flags (admin only)' })
  async getFeatureFlags() {
    return this.adminService.getFeatureFlags();
  }

  @Put('feature-flags/:flagId')
  @RequirePermission('feature_flags.manage')
  @UseInterceptors(AuditInterceptor)
  @Audit('feature_flags.update', 'FeatureFlag')
  @ApiOperation({ summary: 'Update feature flag (admin only)' })
  async updateFeatureFlag(
    @Param('flagId') flagId: string,
    @Body('isEnabledGlobal') isEnabledGlobal: boolean,
  ) {
    return this.adminService.updateFeatureFlag(flagId, isEnabledGlobal);
  }

  // Apartments
  @Get('projects/:projectId/apartments/:apartmentId/users')
  @RequirePermission('users.manage')
  @ApiOperation({ summary: 'Get apartment users (admin only)' })
  async getApartmentUsers(
    @Param('projectId') projectId: string,
    @Param('apartmentId') apartmentId: string,
  ) {
    return this.apartmentsService.getApartmentUsers(projectId, apartmentId);
  }

  @Post('projects/:projectId/apartments/:apartmentId/users')
  @RequirePermission('users.manage')
  @UseInterceptors(AuditInterceptor)
  @Audit('apartments.user_assigned', 'ApartmentUser')
  @ApiOperation({ summary: 'Assign user to apartment (admin only, max 2 users)' })
  async assignUserToApartment(
    @Param('projectId') projectId: string,
    @Param('apartmentId') apartmentId: string,
    @CurrentUser() user: any,
    @Body() dto: AssignUserToApartmentDto,
  ) {
    return this.apartmentsService.assignUserToApartment(projectId, apartmentId, dto, user.userId);
  }

  @Delete('projects/:projectId/apartments/:apartmentId/users/:apartmentUserId')
  @RequirePermission('users.manage')
  @UseInterceptors(AuditInterceptor)
  @Audit('apartments.remove_user', 'ApartmentUser')
  @ApiOperation({ summary: 'Remove user from apartment (admin only)' })
  async removeUserFromApartment(
    @Param('projectId') projectId: string,
    @Param('apartmentId') apartmentId: string,
    @Param('apartmentUserId') apartmentUserId: string,
  ) {
    return this.apartmentsService.removeUserFromApartment(projectId, apartmentId, apartmentUserId);
  }
}
