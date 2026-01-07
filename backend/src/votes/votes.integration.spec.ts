import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../common/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { VoteStatus, VoteAudience, Role } from '@prisma/client';

describe('VotesModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let adminToken: string;
  let committeeToken: string;
  let residentToken: string;
  let otherResidentToken: string;

  let adminUser: any;
  let committeeUser: any;
  let residentUser: any;
  let otherResidentUser: any;

  let testProject: any;
  let testVote: any;
  let testOption1: any;
  let testOption2: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    // Clear DB and seed test data
    await prisma.$transaction([
      prisma.voteBallot.deleteMany(),
      prisma.voteOption.deleteMany(),
      prisma.vote.deleteMany(),
      prisma.documentAssignment.deleteMany(),
      prisma.document.deleteMany(),
      prisma.apartmentUser.deleteMany(),
      prisma.apartment.deleteMany(),
      prisma.projectMembership.deleteMany(),
      prisma.projectLog.deleteMany(),
      prisma.message.deleteMany(),
      prisma.auditEvent.deleteMany(),
      prisma.impersonationSession.deleteMany(),
      prisma.user.deleteMany(),
      prisma.rolePermission.deleteMany(),
      prisma.permission.deleteMany(),
      prisma.role.deleteMany(),
      prisma.project.deleteMany(),
    ]);

    // Seed roles and permissions
    await prisma.role.createMany({
      data: [
        { id: 'role-admin', name: 'admin_root' },
        { id: 'role-committee', name: 'committee' },
        { id: 'role-resident', name: 'resident' },
      ],
    });
    const permissions = [
      'project.read', 'project.manage', 'users.manage', 'roles.manage',
      'documents.read_own', 'documents.read_project', 'documents.sign_own',
      'votes.read', 'votes.vote', 'votes.create', 'votes.manage',
      'messages.read', 'messages.create', 'messages.schedule',
      'files.upload_project', 'audit.read', 'feature_flags.manage', 'impersonate.use', 'system.delete'
    ];
    await prisma.permission.createMany({
      data: permissions.map(key => ({ key, id: `perm-${key.replace('.', '_')}` })),
    });
    const adminPerms = permissions.map(key => ({ roleId: 'role-admin', permissionId: `perm-${key.replace('.', '_')}` }));
    const committeePerms = ['project.read', 'documents.read_project', 'votes.read', 'votes.vote', 'votes.create', 'votes.manage', 'messages.read', 'messages.create', 'messages.schedule', 'files.upload_project', 'audit.read'].map(key => ({ roleId: 'role-committee', permissionId: `perm-${key.replace('.', '_')}` }));
    const residentPerms = ['project.read', 'documents.read_own', 'documents.sign_own', 'votes.read', 'votes.vote', 'messages.read'].map(key => ({ roleId: 'role-resident', permissionId: `perm-${key.replace('.', '_')}` }));
    await prisma.rolePermission.createMany({ data: [...adminPerms, ...committeePerms, ...residentPerms] });

    // Create users
    adminUser = await prisma.user.create({ data: { email: 'admin@example.com', name: 'Admin User', password: 'password', globalRole: 'admin_root' } });
    committeeUser = await prisma.user.create({ data: { email: 'committee@example.com', name: 'Committee User', password: 'password' } });
    residentUser = await prisma.user.create({ data: { email: 'resident@example.com', name: 'Resident User', password: 'password' } });
    otherResidentUser = await prisma.user.create({ data: { email: 'other.resident@example.com', name: 'Other Resident', password: 'password' } });

    // Create project
    testProject = await prisma.project.create({ data: { name: 'Test Project', createdById: adminUser.id } });

    // Create memberships
    await prisma.projectMembership.createMany({
      data: [
        { projectId: testProject.id, userId: adminUser.id, roleId: 'role-admin' },
        { projectId: testProject.id, userId: committeeUser.id, roleId: 'role-committee' },
        { projectId: testProject.id, userId: residentUser.id, roleId: 'role-resident' },
        { projectId: testProject.id, userId: otherResidentUser.id, roleId: 'role-resident' },
      ],
    });

    // Create test vote
    const opensAt = new Date();
    const closesAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    testVote = await prisma.vote.create({
      data: {
        projectId: testProject.id,
        title: 'Test Vote',
        description: 'Test Description',
        audienceFilter: VoteAudience.ALL_RESIDENTS,
        opensAt,
        closesAt,
        status: VoteStatus.OPEN,
        createdByUserId: committeeUser.id,
        options: {
          create: [
            { label: 'Option 1', sortOrder: 0 },
            { label: 'Option 2', sortOrder: 1 },
          ],
        },
      },
      include: { options: true },
    });
    testOption1 = testVote.options[0];
    testOption2 = testVote.options[1];

    // Generate tokens
    adminToken = jwtService.sign({ userId: adminUser.id, email: adminUser.email, role: 'admin_root', projectId: testProject.id });
    committeeToken = jwtService.sign({ userId: committeeUser.id, email: committeeUser.email, role: 'committee', projectId: testProject.id });
    residentToken = jwtService.sign({ userId: residentUser.id, email: residentUser.email, role: 'resident', projectId: testProject.id });
    otherResidentToken = jwtService.sign({ userId: otherResidentUser.id, email: otherResidentUser.email, role: 'resident', projectId: testProject.id });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('RBAC Tests', () => {
    it('should allow committee to create vote', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/projects/${testProject.id}/votes`)
        .set('Authorization', `Bearer ${committeeToken}`)
        .send({
          title: 'New Vote',
          description: 'New Description',
          audienceFilter: VoteAudience.ALL_RESIDENTS,
          opensAt: new Date().toISOString(),
          closesAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          options: [
            { label: 'Yes', sortOrder: 0 },
            { label: 'No', sortOrder: 1 },
          ],
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New Vote');
      expect(response.body.status).toBe(VoteStatus.DRAFT);
    });

    it('should deny resident from creating vote', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/projects/${testProject.id}/votes`)
        .set('Authorization', `Bearer ${residentToken}`)
        .send({
          title: 'Unauthorized Vote',
          audienceFilter: VoteAudience.ALL_RESIDENTS,
          opensAt: new Date().toISOString(),
          closesAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          options: [
            { label: 'Yes' },
            { label: 'No' },
          ],
        })
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('Isolation Tests', () => {
    it('should allow resident to see their own ballot only', async () => {
      // Resident votes
      await request(app.getHttpServer())
        .post(`/api/v1/me/votes/${testVote.id}/ballot`)
        .set('Authorization', `Bearer ${residentToken}`)
        .send({ optionId: testOption1.id })
        .expect(HttpStatus.CREATED);

      // Resident can see their vote
      const response = await request(app.getHttpServer())
        .get(`/api/v1/me/votes/${testVote.id}`)
        .set('Authorization', `Bearer ${residentToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.userVoted).toBe(true);
      expect(response.body.userVote).toBeDefined();
    });

    it('should not allow resident to see other users ballots', async () => {
      // Other resident votes
      await request(app.getHttpServer())
        .post(`/api/v1/me/votes/${testVote.id}/ballot`)
        .set('Authorization', `Bearer ${otherResidentToken}`)
        .send({ optionId: testOption2.id })
        .expect(HttpStatus.CREATED);

      // First resident cannot see other's ballot
      const response = await request(app.getHttpServer())
        .get(`/api/v1/me/votes/${testVote.id}`)
        .set('Authorization', `Bearer ${residentToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.userVote.optionId).toBe(testOption1.id); // Their own vote
    });
  });

  describe('One Vote Per User', () => {
    it('should enforce one vote per user (idempotent)', async () => {
      // First vote
      const firstResponse = await request(app.getHttpServer())
        .post(`/api/v1/me/votes/${testVote.id}/ballot`)
        .set('Authorization', `Bearer ${residentToken}`)
        .send({ optionId: testOption1.id })
        .expect(HttpStatus.CREATED);

      // Try to vote again (should return existing)
      const secondResponse = await request(app.getHttpServer())
        .post(`/api/v1/me/votes/${testVote.id}/ballot`)
        .set('Authorization', `Bearer ${residentToken}`)
        .send({ optionId: testOption2.id })
        .expect(HttpStatus.OK); // 200, not 201

      expect(secondResponse.body.message).toBe('You have already voted');
      expect(secondResponse.body.optionId).toBe(testOption1.id); // Original vote
    });
  });

  describe('Deadline Enforcement', () => {
    it('should deny voting after deadline', async () => {
      // Create vote with past deadline
      const pastVote = await prisma.vote.create({
        data: {
          projectId: testProject.id,
          title: 'Past Vote',
          audienceFilter: VoteAudience.ALL_RESIDENTS,
          opensAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          closesAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          status: VoteStatus.OPEN,
          createdByUserId: committeeUser.id,
          options: {
            create: [
              { label: 'Yes', sortOrder: 0 },
              { label: 'No', sortOrder: 1 },
            ],
          },
        },
        include: { options: true },
      });

      await request(app.getHttpServer())
        .post(`/api/v1/me/votes/${pastVote.id}/ballot`)
        .set('Authorization', `Bearer ${residentToken}`)
        .send({ optionId: pastVote.options[0].id })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Participation Endpoint', () => {
    it('should allow committee to view participation', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects/${testProject.id}/votes/${testVote.id}/participation`)
        .set('Authorization', `Bearer ${committeeToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('voted');
      expect(response.body).toHaveProperty('notVoted');
      expect(response.body).toHaveProperty('totalEligible');
      expect(response.body).toHaveProperty('participationRate');
    });

    it('should deny resident from viewing participation', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/projects/${testProject.id}/votes/${testVote.id}/participation`)
        .set('Authorization', `Bearer ${residentToken}`)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
