# Or LaDerech - Physical Architecture Diagram

**Version:** 1.0  
**Last Updated:** Based on current codebase state  
**Assumptions:** Single Project Mode (1 project, ~200 residents), Local Storage, In-Memory Job Queue

---

## Table of Contents

1. [System Context Diagram](#1-system-context-diagram)
2. [Backend Container Diagram](#2-backend-container-diagram)
3. [Backend Modules Diagram](#3-backend-modules-diagram-nestjs)
4. [Database Physical Schema](#4-database-physical-schema)
5. [Core Flows](#5-core-flows)
   - [Document Signing Flow](#51-document-signing-flow)
   - [Voting Flow](#52-voting-flow)
   - [Download Token Flow](#53-download-token-flow)

---

## 1. System Context Diagram

Shows the system and its external actors/interfaces.

```mermaid
graph TB
    subgraph "External Actors"
        Resident[Resident User<br/>~200 users]
        Committee[Committee Member<br/>~5-10 users]
        Admin[Admin Root<br/>1-3 users]
    end

    subgraph "Or LaDerech System"
        API[NestJS Backend API<br/>Port 3000<br/>/api/v1]
        DB[(PostgreSQL Database<br/>RLS Enabled)]
        Storage[Local File Storage<br/>./storage<br/>Cloud-ready: S3]
        Jobs[In-Memory Job Queue<br/>Cloud-ready: Redis/Bull]
    end

    Resident -->|HTTPS<br/>JWT Auth| API
    Committee -->|HTTPS<br/>JWT Auth| API
    Admin -->|HTTPS<br/>JWT Auth| API

    API -->|Prisma ORM<br/>Session vars| DB
    API -->|File I/O| Storage
    API -->|Async Jobs| Jobs

    style API fill:#4a90e2,color:#fff
    style DB fill:#336791,color:#fff
    style Storage fill:#f39c12,color:#fff
    style Jobs fill:#e74c3c,color:#fff
```

**Explanation:**
- **External Actors:** Three user roles (Resident, Committee, Admin Root) interact with the system via HTTPS
- **NestJS Backend API:** Main application server on port 3000, exposes REST API at `/api/v1`
- **PostgreSQL Database:** Primary data store with Row Level Security (RLS) enabled for multi-tenant isolation
- **Local File Storage:** Currently local filesystem (`./storage`), designed to be S3-ready
- **In-Memory Job Queue:** Currently in-memory, designed to be Redis/Bull-ready for scheduled tasks

**Assumptions:**
- Single Project Mode: One project with ~200 residents
- Local deployment (not cloud yet, but cloud-ready abstractions in place)
- JWT-based authentication for all API access

---

## 2. Backend Container Diagram

Shows the main containers/components within the backend system.

```mermaid
graph TB
    subgraph "Backend Application"
        subgraph "API Layer"
            Controllers[Controllers<br/>- AuthController<br/>- DocumentsController<br/>- VotesController<br/>- MessagesController<br/>- ProjectsController<br/>- AdminController<br/>- MeDocumentsController<br/>- MeVotesController<br/>- StorageController]
        end

        subgraph "Service Layer"
            Services[Business Services<br/>- AuthService<br/>- DocumentsService<br/>- VotesService<br/>- MessagesService<br/>- ProjectsService<br/>- AdminService<br/>- AuditService<br/>- StorageService<br/>- DownloadTokenService]
        end

        subgraph "Infrastructure"
            Guards[Guards & Middleware<br/>- JwtAuthGuard<br/>- PermissionsGuard<br/>- ProjectMembershipGuard<br/>- ThrottlerGuard]
            Prisma[PrismaService<br/>ORM + Session Management]
            Config[ConfigService<br/>Environment Config]
        end

        subgraph "Abstractions"
            StorageI[Storage Interface<br/>Local/S3]
            JobQueueI[Job Queue Interface<br/>In-Memory/Redis]
        end
    end

    subgraph "External Systems"
        PostgreSQL[(PostgreSQL<br/>Database)]
        LocalFS[Local File System<br/>./storage]
        InMemoryQ[In-Memory Queue<br/>Scheduled Jobs]
    end

    Controllers -->|Uses| Services
    Controllers -->|Protected by| Guards
    Services -->|Uses| Prisma
    Services -->|Uses| Config
    Services -->|Implements| StorageI
    Services -->|Implements| JobQueueI

    Prisma -->|Connects to| PostgreSQL
    StorageI -->|Reads/Writes| LocalFS
    JobQueueI -->|Schedules| InMemoryQ

    style Controllers fill:#3498db,color:#fff
    style Services fill:#2ecc71,color:#fff
    style Guards fill:#e67e22,color:#fff
    style Prisma fill:#9b59b6,color:#fff
    style PostgreSQL fill:#34495e,color:#fff
```

**Explanation:**
- **API Layer:** REST controllers handle HTTP requests, route to appropriate services
- **Service Layer:** Business logic, data access, orchestration
- **Infrastructure:** Guards enforce RBAC and multi-tenant isolation, Prisma handles DB access with session vars for RLS
- **Abstractions:** Cloud-ready interfaces allow switching between local/S3 storage and in-memory/Redis job queues
- **External Systems:** PostgreSQL (with RLS), local filesystem, in-memory job queue

**Security Boundaries:**
- **JWT Auth:** All API endpoints (except `/storage/download`) require JWT token
- **RBAC:** PermissionsGuard enforces role-based access control
- **Multi-tenant:** ProjectMembershipGuard ensures project isolation
- **RLS:** Database-level policies enforce tenant isolation

---

## 3. Backend Modules Diagram (NestJS)

Shows NestJS module dependencies and structure.

```mermaid
graph TB
    subgraph "Root Module"
        AppModule[AppModule<br/>Root Application]
    end

    subgraph "Core Infrastructure Modules"
        ConfigModule[ConfigModule<br/>ConfigService]
        AuditModule[AuditModule<br/>AuditService]
        StorageModule[StorageModule<br/>StorageService<br/>DownloadTokenService<br/>StorageController]
        JobQueueModule[JobQueueModule<br/>JobQueueService]
        HealthModule[HealthModule<br/>HealthController]
    end

    subgraph "Feature Modules"
        AuthModule[AuthModule<br/>AuthController<br/>AuthService]
        ProjectsModule[ProjectsModule<br/>ProjectsController<br/>ProjectsService]
        DocumentsModule[DocumentsModule<br/>DocumentsController<br/>DocumentsService]
        VotesModule[VotesModule<br/>VotesController<br/>VotesService]
        MessagesModule[MessagesModule<br/>MessagesController<br/>MessagesService]
        ProjectLogsModule[ProjectLogsModule<br/>ProjectLogsController<br/>ProjectLogsService]
        AdminModule[AdminModule<br/>AdminController<br/>AdminService<br/>ApartmentsService]
    end

    subgraph "App Module (Single Project Mode)"
        AppMeModule[AppModule<br/>MeController<br/>MeDocumentsController<br/>MeVotesController]
    end

    subgraph "Shared Services"
        PrismaService[PrismaService<br/>Global]
    end

    AppModule -->|Imports| ConfigModule
    AppModule -->|Imports| AuditModule
    AppModule -->|Imports| StorageModule
    AppModule -->|Imports| JobQueueModule
    AppModule -->|Imports| HealthModule
    AppModule -->|Imports| AuthModule
    AppModule -->|Imports| ProjectsModule
    AppModule -->|Imports| DocumentsModule
    AppModule -->|Imports| VotesModule
    AppModule -->|Imports| MessagesModule
    AppModule -->|Imports| ProjectLogsModule
    AppModule -->|Imports| AdminModule
    AppModule -->|Imports| AppMeModule
    AppModule -->|Provides| PrismaService

    DocumentsModule -->|Imports| StorageModule
    DocumentsModule -->|Imports| AuditModule
    VotesModule -->|Imports| AuditModule
    VotesModule -->|Imports| JobQueueModule
    MessagesModule -->|Imports| JobQueueModule
    AppMeModule -->|Imports| DocumentsModule
    AppMeModule -->|Imports| VotesModule
    AppMeModule -->|Imports| MessagesModule
    AppMeModule -->|Imports| ProjectsModule

    style AppModule fill:#e74c3c,color:#fff
    style ConfigModule fill:#3498db,color:#fff
    style StorageModule fill:#2ecc71,color:#fff
    style JobQueueModule fill:#f39c12,color:#fff
    style AuditModule fill:#9b59b6,color:#fff
```

**Explanation:**
- **Root Module (AppModule):** Orchestrates all feature modules and provides global services (PrismaService, ThrottlerGuard)
- **Core Infrastructure:** Config, Audit, Storage, JobQueue, Health - used across all features
- **Feature Modules:** Domain-specific modules (Auth, Projects, Documents, Votes, Messages, etc.)
- **App Module:** Special module for Single Project Mode endpoints (`/api/v1/me/*`)
- **Dependencies:** DocumentsModule depends on StorageModule and AuditModule; VotesModule depends on AuditModule and JobQueueModule

**Module Boundaries:**
- Each module encapsulates its domain logic
- Global modules (StorageModule, JobQueueModule) are marked with `@Global()` decorator
- PrismaService is provided at root level for all modules

---

## 4. Database Physical Schema

Shows the physical database tables, relationships, and key constraints.

```mermaid
erDiagram
    User ||--o{ ProjectMembership : "has"
    User ||--o{ ApartmentUser : "lives_in"
    User ||--o{ DocumentAssignment : "assigned_to"
    User ||--o{ VoteBallot : "voted"
    User ||--o{ AuditEvent : "performed"
    User ||--o{ ImpersonationSession : "impersonates"

    Role ||--o{ ProjectMembership : "assigned"
    Role ||--o{ RolePermission : "has"
    Permission ||--o{ RolePermission : "granted_to"

    Project ||--o{ ProjectMembership : "contains"
    Project ||--o{ Apartment : "has"
    Project ||--o{ Document : "contains"
    Project ||--o{ Vote : "contains"
    Project ||--o{ Message : "contains"
    Project ||--o{ ProjectLog : "has"
    Project ||--o{ AuditEvent : "scoped_to"

    Apartment ||--o{ ApartmentUser : "occupied_by"
    Document ||--o{ DocumentAssignment : "assigned_as"
    Vote ||--o{ VoteOption : "has"
    Vote ||--o{ VoteBallot : "receives"
    VoteOption ||--o{ VoteBallot : "selected_in"

    FeatureFlag ||--o{ FeatureFlagScope : "scoped"

    User {
        uuid id PK
        string email UK
        string name
        string password
        string global_role
        boolean is_enabled
        datetime created_at
    }

    Role {
        uuid id PK
        string name UK
        string description
    }

    Permission {
        uuid id PK
        string key UK
        string description
    }

    RolePermission {
        uuid role_id PK
        uuid permission_id PK
    }

    Project {
        uuid id PK
        string name
        enum status_stage
        int status_percent
        boolean is_active
        uuid created_by FK
        datetime created_at
    }

    ProjectMembership {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        uuid role_id FK
        datetime created_at
        unique project_id_user_id
    }

    Apartment {
        uuid id PK
        uuid project_id FK
        string building
        string unit_number
        decimal current_sqm
        decimal future_sqm
        unique id_project_id
    }

    ApartmentUser {
        uuid id PK
        uuid project_id FK
        uuid apartment_id FK
        uuid user_id FK
        string role_in_apartment
        datetime created_at
        unique apartment_id_user_id
        index project_id
        index apartment_id_project_id
    }

    Document {
        uuid id PK
        uuid project_id FK
        string title
        enum doc_type
        string storage_key
        string mime_type
        int size_bytes
        uuid created_by_user_id FK
        datetime created_at
        index project_id
        index created_by_user_id
    }

    DocumentAssignment {
        uuid id PK
        uuid project_id FK
        uuid document_id FK
        uuid resident_user_id FK
        enum status
        datetime signed_at
        string signature_provider
        json signature_metadata
        datetime assigned_at
        unique document_id_resident_user_id
        index project_id
        index document_id
        index resident_user_id
        index status
    }

    Vote {
        uuid id PK
        uuid project_id FK
        string title
        string description
        enum audience_filter
        datetime opens_at
        datetime closes_at
        enum status
        uuid created_by_user_id FK
        datetime created_at
        index project_id_status
        index project_id_closes_at
    }

    VoteOption {
        uuid id PK
        uuid vote_id FK
        string label
        int sort_order
    }

    VoteBallot {
        uuid id PK
        uuid project_id FK
        uuid vote_id FK
        uuid voter_user_id FK
        uuid option_id FK
        datetime voted_at
        unique vote_id_voter_user_id
        index vote_id_voter_user_id
        index project_id
    }

    Message {
        uuid id PK
        uuid project_id FK
        string title
        string body
        enum audience_filter
        datetime scheduled_at
        datetime sent_at
        uuid created_by_user_id FK
        datetime created_at
    }

    ProjectLog {
        uuid id PK
        uuid project_id FK
        enum log_type
        string title
        string notes
        uuid created_by_user_id FK
        datetime created_at
    }

    AuditEvent {
        uuid id PK
        datetime occurred_at
        uuid actor_user_id FK
        uuid project_id FK
        string action_key
        string target_type
        uuid target_id
        json metadata
        string ip_address
        string user_agent
    }

    ImpersonationSession {
        uuid id PK
        uuid admin_user_id FK
        uuid impersonated_user_id FK
        datetime started_at
        datetime ended_at
        string reason
    }

    FeatureFlag {
        uuid id PK
        string key UK
        string description
        boolean is_enabled_global
    }

    FeatureFlagScope {
        uuid id PK
        uuid flag_id FK
        enum scope_type
        string scope_value
        boolean is_enabled
    }
```

**Explanation:**
- **Core Entities:** User, Role, Permission, Project - foundation of RBAC and multi-tenant model
- **Resident Domain:** Apartment, ApartmentUser (max 2 users per apartment, enforced by trigger)
- **Documents:** Document, DocumentAssignment (immutable once signed, enforced by trigger)
- **Voting:** Vote, VoteOption, VoteBallot (one vote per user, enforced by unique constraint)
- **Messaging:** Message (scheduled messages with audience filters)
- **Audit & Security:** AuditEvent (all critical actions), ImpersonationSession (admin impersonation)

**Key Constraints:**
- **Multi-tenant:** All tables have `project_id` FK (except User, Role, Permission)
- **RLS:** Row Level Security enabled on all tenant-scoped tables
- **Triggers:** 
  - `check_apartment_user_limit()` - Max 2 users per apartment
  - `check_document_assignment_immutable()` - Signed documents immutable
- **Unique Constraints:**
  - `(project_id, user_id)` on ProjectMembership
  - `(apartment_id, user_id)` on ApartmentUser
  - `(document_id, resident_user_id)` on DocumentAssignment
  - `(vote_id, voter_user_id)` on VoteBallot

---

## 5. Core Flows

### 5.1 Document Signing Flow

Shows the complete flow from document upload to resident signing.

```mermaid
sequenceDiagram
    participant C as Committee/Admin
    participant API as DocumentsController
    participant DS as DocumentsService
    participant SS as StorageService
    participant PS as PrismaService
    participant DB as PostgreSQL
    participant AS as AuditService
    participant R as Resident
    participant SC as StorageController

    Note over C,DB: 1. Upload Document
    C->>API: POST /api/v1/projects/:id/documents<br/>(multipart/form-data)
    API->>DS: uploadDocument(projectId, userId, file, metadata)
    DS->>SS: upload(fileBuffer, storageKey, mimeType)
    SS->>SS: Write to ./storage
    SS-->>DS: storageKey
    DS->>PS: create Document record
    PS->>DB: INSERT INTO documents<br/>(RLS: committee/admin only)
    DB-->>PS: document
    DS->>AS: log('documents.uploaded')
    AS->>DB: INSERT INTO audit_events
    DS-->>API: document
    API-->>C: 201 Created

    Note over C,DB: 2. Assign Document
    C->>API: POST /api/v1/projects/:id/documents/:docId/assign<br/>(target: apartment/users)
    API->>DS: assignDocument(projectId, docId, dto)
    DS->>PS: findMany ApartmentUser (if apartment)
    PS->>DB: SELECT FROM apartment_users<br/>(RLS: committee/admin)
    DB-->>PS: userIds
    DS->>PS: createMany DocumentAssignment
    PS->>DB: INSERT INTO document_assignments<br/>(RLS: committee/admin only)
    DB-->>PS: assignments
    DS->>AS: log('documents.assigned') for each
    AS->>DB: INSERT INTO audit_events
    DS-->>API: assignments
    API-->>C: 201 Created

    Note over R,DB: 3. Resident Downloads & Signs
    R->>API: GET /api/v1/me/documents/:assignmentId/download
    API->>DS: downloadDocument(assignmentId, userId)
    DS->>PS: findUnique DocumentAssignment
    PS->>DB: SELECT FROM document_assignments<br/>(RLS: own assignments only)
    DB-->>PS: assignment
    DS->>DS: Generate download token (10min TTL)
    DS-->>API: { downloadUrl, expiresAt }
    API-->>R: 200 OK

    R->>SC: GET /api/v1/storage/download?token=...
    Note over SC: No JWT auth required<br/>Token validation only
    SC->>SC: validateToken(token)
    SC->>SS: Read file from ./storage
    SS-->>SC: fileBuffer
    SC-->>R: 200 OK (file)

    R->>API: POST /api/v1/me/documents/:assignmentId/sign
    API->>DS: signDocument(assignmentId, userId, metadata)
    DS->>PS: findUnique DocumentAssignment
    PS->>DB: SELECT FROM document_assignments<br/>(RLS: own assignments only)
    DB-->>PS: assignment
    alt Already signed
        DS-->>API: { ...assignment, message: 'already signed' }
    else Not signed
        DS->>PS: update DocumentAssignment (status=SIGNED)
        PS->>DB: UPDATE document_assignments<br/>(Trigger: check immutability)
        DB-->>PS: updated
        DS->>AS: log('documents.signed')
        AS->>DB: INSERT INTO audit_events
        DS-->>API: assignment
    end
    API-->>R: 200 OK
```

**Explanation:**
1. **Upload:** Committee uploads document, stored in local filesystem, metadata saved to DB
2. **Assign:** Document assigned to residents (via apartment or direct user list), creates DocumentAssignment records
3. **Download:** Resident requests download URL, receives tokenized URL (10min TTL), downloads via public endpoint (no JWT required)
4. **Sign:** Resident signs document, status updated to SIGNED, trigger prevents future modifications, audit event logged

**Security Boundaries:**
- **RLS:** Database enforces tenant isolation and role-based access
- **Trigger:** `check_document_assignment_immutable()` prevents modification of signed assignments
- **Token:** Download token uses separate secret (`DOWNLOAD_JWT_SECRET`), short TTL (10min)

---

### 5.2 Voting Flow

Shows the complete flow from vote creation to ballot submission and results.

```mermaid
sequenceDiagram
    participant C as Committee/Admin
    participant API as VotesController
    participant VS as VotesService
    participant PS as PrismaService
    participant DB as PostgreSQL
    participant AS as AuditService
    participant JQ as JobQueueService
    participant R as Resident
    participant API2 as MeVotesController

    Note over C,DB: 1. Create Vote
    C->>API: POST /api/v1/projects/:id/votes<br/>(title, options, opensAt, closesAt)
    API->>VS: create(projectId, userId, dto)
    VS->>PS: create Vote + VoteOptions
    PS->>DB: INSERT INTO votes<br/>(RLS: committee/admin only)
    PS->>DB: INSERT INTO vote_options<br/>(RLS: committee/admin only)
    DB-->>PS: vote
    alt closesAt - now >= 24h
        VS->>JQ: add('vote-reminder', { voteId }, { delay })
        Note over JQ: Schedule reminder<br/>24h before close
    end
    VS->>AS: log('votes.created')
    AS->>DB: INSERT INTO audit_events
    VS-->>API: vote
    API-->>C: 201 Created

    Note over C,DB: 2. Close Vote (Optional)
    C->>API: POST /api/v1/projects/:id/votes/:voteId/close
    API->>VS: close(voteId, userId)
    VS->>PS: update Vote (status=CLOSED)
    PS->>DB: UPDATE votes<br/>(RLS: committee/admin only)
    DB-->>PS: updated
    VS->>AS: log('votes.closed')
    AS->>DB: INSERT INTO audit_events
    VS-->>API: updated
    API-->>C: 200 OK

    Note over R,DB: 3. Resident Votes
    R->>API2: GET /api/v1/me/votes/:voteId
    API2->>VS: findOne(voteId, userId)
    VS->>PS: findUnique Vote + options
    PS->>DB: SELECT FROM votes<br/>(RLS: project members)
    DB-->>PS: vote
    VS->>PS: findFirst VoteBallot (user's ballot)
    PS->>DB: SELECT FROM vote_ballots<br/>(RLS: own ballots only)
    DB-->>PS: userBallot
    VS-->>API2: { vote, userVoted, userVote }
    API2-->>R: 200 OK

    R->>API2: POST /api/v1/me/votes/:voteId/ballot<br/>(optionId)
    API2->>VS: vote(voteId, optionId, userId)
    VS->>PS: findUnique Vote
    PS->>DB: SELECT FROM votes<br/>(RLS: project members)
    DB-->>PS: vote
    VS->>VS: Validate: status=OPEN, now >= opensAt, now < closesAt
    alt Already voted
        VS->>PS: findFirst VoteBallot
        PS->>DB: SELECT FROM vote_ballots<br/>(RLS: own ballots)
        DB-->>PS: existing
        VS-->>API2: { ...existing, message: 'already voted' }
        Note over VS: No audit event<br/>(idempotent)
    else New vote
        VS->>PS: create VoteBallot
        PS->>DB: INSERT INTO vote_ballots<br/>(RLS: voter_user_id = current_user_id()<br/>AND status=OPEN AND now < closes_at)
        DB-->>PS: ballot
        VS->>AS: log('votes.voted')
        AS->>DB: INSERT INTO audit_events
        VS-->>API2: ballot
    end
    API2-->>R: 200 OK

    Note over C,DB: 4. View Results
    C->>API: GET /api/v1/projects/:id/votes/:voteId/results
    API->>VS: getResults(voteId, userId)
    VS->>PS: findUnique Vote + options + ballots
    PS->>DB: SELECT FROM votes, vote_options, vote_ballots<br/>(RLS: committee/admin)
    DB-->>PS: vote data
    VS->>VS: Calculate: option counts, participation rate
    VS->>PS: getEligibleVoterCount (based on audienceFilter)
    PS->>DB: SELECT COUNT FROM project_memberships<br/>(RLS: committee/admin)
    DB-->>PS: eligibleCount
    VS-->>API: { vote, options[], totalVotes, totalEligible, participationRate }
    API-->>C: 200 OK
```

**Explanation:**
1. **Create Vote:** Committee creates vote with options and time window, reminder job scheduled if enough time remains
2. **Close Vote:** Committee can manually close vote (optional, can also auto-close at closesAt)
3. **Resident Votes:** Resident views vote, submits ballot (idempotent - returns existing if already voted, no duplicate audit)
4. **View Results:** Committee views aggregated results with participation statistics

**Security Boundaries:**
- **RLS:** Database enforces tenant isolation, residents see only own ballots
- **Time Validation:** Service and RLS enforce `now >= opensAt AND now < closesAt`
- **Unique Constraint:** `(vote_id, voter_user_id)` prevents double voting at DB level
- **Idempotency:** Service returns existing ballot without duplicate audit event

---

### 5.3 Download Token Flow

Shows the secure token-based file download flow for local storage.

```mermaid
sequenceDiagram
    participant R as Resident
    participant API as MeDocumentsController
    participant DS as DocumentsService
    participant DTS as DownloadTokenService
    participant PS as PrismaService
    participant DB as PostgreSQL
    participant SC as StorageController
    participant SS as StorageService
    participant FS as File System

    Note over R,FS: 1. Request Download URL
    R->>API: GET /api/v1/me/documents/:assignmentId/download<br/>(JWT Bearer Token)
    API->>DS: downloadDocument(assignmentId, userId)
    DS->>PS: findUnique DocumentAssignment
    PS->>DB: SELECT FROM document_assignments<br/>(RLS: own assignments only)
    DB-->>PS: assignment
    DS->>DS: Validate: assignment.residentUserId === userId
    DS->>DTS: generateToken(userId, assignmentId, storageKey)
    Note over DTS: Secret: DOWNLOAD_JWT_SECRET<br/>TTL: DOWNLOAD_TOKEN_TTL (default 10m)
    DTS->>DTS: JWT.sign({ userId, assignmentId, storageKey, exp })
    DTS-->>DS: token
    DS->>SS: getDownloadUrl(storageKey, token)
    SS-->>DS: /api/v1/storage/download?token=...
    DS-->>API: { downloadUrl, expiresAt }
    API-->>R: 200 OK

    Note over R,FS: 2. Download File (Public Endpoint)
    R->>SC: GET /api/v1/storage/download?token=...<br/>(NO JWT required)
    SC->>DTS: validateToken(token)
    DTS->>DTS: JWT.verify(token, DOWNLOAD_JWT_SECRET)
    alt Token invalid/expired
        DTS-->>SC: Error
        SC-->>R: 401/404 Unauthorized
    else Token valid
        DTS-->>SC: { userId, assignmentId, storageKey }
        SC->>SC: Validate: no path traversal (../, absolute paths)
        SC->>SS: Read file
        SS->>FS: fs.readFile(storageKey)
        FS-->>SS: fileBuffer
        SS-->>SC: fileBuffer
        SC-->>R: 200 OK (file content)
    end

    Note over R,FS: 3. S3 Alternative (Future)
    Note over DS,SS: When STORAGE_PROVIDER=s3:<br/>- getS3PresignedUrl() returns S3 URL directly<br/>- No token validation needed<br/>- S3 handles expiration
```

**Explanation:**
1. **Request Download URL:** Resident requests download URL, system generates short-lived JWT token (10min TTL) with separate secret
2. **Download File:** Resident uses token to download via public endpoint (no JWT auth required), token validated, path traversal prevented, file served
3. **S3 Alternative:** When using S3, presigned URLs returned directly (no token validation on download path)

**Security Boundaries:**
- **JWT Auth:** Initial request requires JWT token (resident authentication)
- **Download Token:** Separate secret (`DOWNLOAD_JWT_SECRET`), short TTL (10min default)
- **Public Endpoint:** `/storage/download` does NOT require JWT - relies on token validation only
- **Path Traversal:** Service validates storageKey to prevent directory traversal attacks
- **RLS:** Database ensures resident can only access their own assignments

**Token Payload:**
```typescript
{
  userId: string,
  assignmentId: string,
  storageKey: string,
  exp: number // Unix timestamp
}
```

---

## Assumptions & Constraints

### Current Deployment
- **Single Project Mode:** One project with ~200 residents
- **Local Storage:** Files stored in `./storage` directory
- **In-Memory Jobs:** Job queue runs in-memory (no Redis)
- **Local Database:** PostgreSQL running locally (not RDS yet)

### Cloud-Ready Abstractions
- **Storage Interface:** Can switch to S3 by changing `STORAGE_PROVIDER` env var
- **Job Queue Interface:** Can switch to Redis/Bull by changing `JOB_QUEUE_PROVIDER` env var
- **Multi-tenant Ready:** Database schema and RLS support multiple projects (currently using one)

### Security Model
- **JWT Authentication:** All API endpoints (except `/storage/download`) require JWT
- **RBAC:** Permissions enforced at guard level and database RLS
- **Multi-tenant Isolation:** `project_id` enforced at service, guard, and RLS levels
- **Download Tokens:** Separate secret, short TTL, no JWT required for download endpoint

### Database Constraints
- **RLS Enabled:** All tenant-scoped tables have Row Level Security policies
- **Triggers:** 
  - Max 2 users per apartment
  - Signed document assignments immutable
- **Unique Constraints:** Prevent duplicate votes, assignments, memberships

---

## Future Enhancements

1. **S3 Storage:** Implement `getS3PresignedUrl()` in StorageService
2. **Redis Job Queue:** Implement Redis/Bull job queue provider
3. **Multi-Project:** Enable multiple projects (currently Single Project Mode)
4. **UNSIGNED_RESIDENTS Filter:** Implement proper filtering based on signed document assignments
5. **Reminder Jobs:** Implement actual email/push notification sending in `sendVoteReminder()`

---

**Document Version:** 1.0  
**Last Updated:** Based on current codebase state  
**Maintained By:** Development Team
