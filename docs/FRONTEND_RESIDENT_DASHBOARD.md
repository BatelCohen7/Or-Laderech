# Resident Dashboard - Frontend Architecture & UX Design

**Version:** 1.0  
**Last Updated:** Based on Messages V1 implementation  
**Target Users:** Residents (older, non-technical users)

---

## Design Principles

### Visual Identity
- **Color Palette:**
  - Primary: Dark Blue (`#1a365d`, `#2c5282`) - Trust, stability
  - Secondary: Light Blue (`#4299e1`, `#63b3ed`) - Communication, clarity
  - Accent: White (`#ffffff`) - Clean, accessible
  - Background: Light Gray (`#f7fafc`) - Subtle, non-distracting
  - Success: Green (`#48bb78`) - Positive actions
  - Warning: Orange (`#ed8936`) - Attention needed
  - Error: Red (`#f56565`) - Urgent actions

- **Typography:**
  - Headings: 24px-32px (large, clear)
  - Body: 16px-18px (readable)
  - Buttons: 18px (prominent)
  - High contrast ratio (WCAG AAA: 7:1 minimum)

- **Spacing:**
  - Generous padding (24px-32px)
  - Card spacing: 16px-24px
  - Touch targets: minimum 44x44px

### UX Principles
- **One Primary Action Per Screen** - Clear focus, no decision paralysis
- **Progressive Disclosure** - Show essential info first, details on demand
- **Status at a Glance** - Visual badges for quick scanning
- **Error Prevention** - Clear labels, confirmation for critical actions
- **Accessibility First** - Screen readers, keyboard navigation, focus indicators

---

## Component Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardHeader.tsx          # Header with project name, language, profile
│   │   │   ├── DashboardLayout.tsx          # Main layout wrapper
│   │   │   └── Navigation.tsx               # Future: sidebar navigation
│   │   ├── cards/
│   │   │   ├── DocumentCard.tsx              # Pending documents card
│   │   │   ├── VoteCard.tsx                  # Active votes card
│   │   │   ├── AnnouncementCard.tsx          # Latest announcements card
│   │   │   └── CardBase.tsx                  # Shared card component
│   │   ├── badges/
│   │   │   ├── StatusBadge.tsx               # Status indicator (pending, signed, etc.)
│   │   │   └── PriorityBadge.tsx             # Urgency indicator
│   │   ├── buttons/
│   │   │   ├── PrimaryButton.tsx              # Main action button
│   │   │   ├── SecondaryButton.tsx         # Secondary actions
│   │   │   └── IconButton.tsx                 # Icon-only buttons
│   │   ├── language/
│   │   │   ├── LanguageSwitcher.tsx          # Language selector dropdown
│   │   │   └── useLanguage.ts                # Language hook
│   │   └── profile/
│   │       ├── ProfileMenu.tsx                # Profile dropdown menu
│   │       └── Avatar.tsx                     # User avatar
│   ├── pages/
│   │   ├── DashboardPage.tsx                 # Main dashboard page
│   │   ├── DocumentsPage.tsx                 # Documents list page
│   │   ├── VotesPage.tsx                     # Votes list page
│   │   └── MessagesPage.tsx                 # Messages list page
│   ├── hooks/
│   │   ├── useDashboardData.ts               # Fetch dashboard data
│   │   ├── useDocuments.ts                   # Documents data hook
│   │   ├── useVotes.ts                       # Votes data hook
│   │   ├── useMessages.ts                    # Messages data hook
│   │   └── useRTL.ts                         # RTL/LTR detection
│   ├── services/
│   │   ├── api/
│   │   │   ├── documents.api.ts              # Documents API calls
│   │   │   ├── votes.api.ts                  # Votes API calls
│   │   │   ├── messages.api.ts               # Messages API calls
│   │   │   └── me.api.ts                     # /api/v1/me/* endpoints
│   │   └── i18n/
│   │       ├── i18n.config.ts                # i18n configuration
│   │       └── translations/
│   │           ├── he.json                   # Hebrew translations
│   │           ├── ar.json                   # Arabic translations
│   │           ├── ru.json                   # Russian translations
│   │           └── en.json                   # English translations
│   ├── styles/
│   │   ├── theme.ts                          # Theme configuration (colors, spacing)
│   │   ├── globals.css                       # Global styles, RTL support
│   │   └── components/
│   │       ├── cards.css                     # Card styles
│   │       └── buttons.css                   # Button styles
│   └── utils/
│       ├── rtl.ts                            # RTL utilities
│       └── accessibility.ts                  # A11y helpers
```

---

## Layout Structure

### Desktop (≥1024px)
```
┌─────────────────────────────────────────────────────────────┐
│  DashboardHeader                                             │
│  [Project Name]  [Language: עברית ▼]  [Profile Avatar ▼]    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Documents    │  │ Active Votes │  │ Announcements│     │
│  │ Card         │  │ Card         │  │ Card         │     │
│  │              │  │              │  │              │     │
│  │ [Status Badge]│  │ [Status Badge]│  │ [Status Badge]│     │
│  │              │  │              │  │              │     │
│  │ [View Docs →]│  │ [View Votes →]│  │ [View All →]│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌─────────────────────────────────────┐
│  DashboardHeader                    │
│  [Project] [Language] [Profile]     │
├─────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐│
│  │ Documents    │  │ Active Votes ││
│  │ Card         │  │ Card         ││
│  └──────────────┘  └──────────────┘│
│  ┌──────────────┐                   │
│  │ Announcements│                   │
│  │ Card         │                   │
│  └──────────────┘                   │
└─────────────────────────────────────┘
```

### Mobile (<768px)
```
┌─────────────────────┐
│  DashboardHeader    │
│  [Project]          │
│  [Language] [Profile]│
├─────────────────────┤
│  ┌─────────────────┐│
│  │ Documents Card   ││
│  └─────────────────┘│
│  ┌─────────────────┐│
│  │ Active Votes Card││
│  └─────────────────┘│
│  ┌─────────────────┐│
│  │ Announcements    ││
│  │ Card            ││
│  └─────────────────┘│
└─────────────────────┘
```

---

## Component Specifications

### 1. DashboardHeader

**Props:**
```typescript
interface DashboardHeaderProps {
  projectName: string;
  userName: string;
  userAvatar?: string;
  currentLanguage: 'he' | 'ar' | 'ru' | 'en';
  onLanguageChange: (lang: 'he' | 'ar' | 'ru' | 'en') => void;
  onProfileClick: () => void;
}
```

**Features:**
- Project name (left-aligned, large font)
- Language switcher (dropdown, flags/icons)
- Profile menu (avatar + dropdown: Profile, Settings, Logout)
- Responsive: Stack on mobile
- RTL-aware: Swap left/right alignment

**Accessibility:**
- `aria-label` for language switcher
- `aria-expanded` for dropdowns
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators

---

### 2. DocumentCard

**Props:**
```typescript
interface DocumentCardProps {
  pendingCount: number;
  signedCount: number;
  latestDocument?: {
    id: string;
    title: string;
    status: 'PENDING' | 'SIGNED';
    assignedAt: string;
  };
  onViewDocuments: () => void;
}
```

**Content:**
- Title: `dashboard.cards.documents.title`
- Status Badge: `pendingCount > 0 ? 'warning' : 'success'`
- Summary: `{pendingCount} pending, {signedCount} signed`
- Primary Action: `dashboard.cards.documents.action.view`
- Icon: Document icon (SVG)

**States:**
- Empty: "No documents" message
- Has pending: Orange badge, "Sign Now" button
- All signed: Green badge, "View Documents" button

---

### 3. VoteCard

**Props:**
```typescript
interface VoteCardProps {
  activeVotes: Array<{
    id: string;
    title: string;
    closesAt: string;
    status: 'OPEN';
    hasVoted: boolean;
  }>;
  onViewVotes: () => void;
  onVote: (voteId: string) => void;
}
```

**Content:**
- Title: `dashboard.cards.votes.title`
- Status Badge: `activeVotes.length > 0 ? 'info' : 'neutral'`
- Summary: `{activeVotes.length} active vote(s)`
- Primary Action: 
  - If has unvoted: `dashboard.cards.votes.action.vote`
  - Else: `dashboard.cards.votes.action.view`
- Icon: Vote/ballot icon

**States:**
- No active votes: "No active votes" message
- Has unvoted: Blue badge, "Vote Now" button
- All voted: Gray badge, "View Results" button

---

### 4. AnnouncementCard

**Props:**
```typescript
interface AnnouncementCardProps {
  latestMessages: Array<{
    id: string;
    title: string;
    body: string;
    deliveredAt: string;
    status: 'UNREAD' | 'READ';
  }>;
  unreadCount: number;
  onViewMessages: () => void;
  onMarkAsRead: (messageId: string) => void;
}
```

**Content:**
- Title: `dashboard.cards.announcements.title`
- Status Badge: `unreadCount > 0 ? 'warning' : 'neutral'`
- Summary: `{unreadCount} unread`
- Latest message preview (title only, truncated)
- Primary Action: `dashboard.cards.announcements.action.view`
- Icon: Bell/announcement icon

**States:**
- No messages: "No announcements" message
- Has unread: Orange badge, "Read Now" button
- All read: Gray badge, "View All" button

---

### 5. CardBase (Shared Component)

**Props:**
```typescript
interface CardBaseProps {
  title: string;
  statusBadge?: {
    label: string;
    variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  };
  icon?: React.ReactNode;
  primaryAction: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  children?: React.ReactNode;
  className?: string;
}
```

**Styling:**
- White background, subtle shadow
- Rounded corners (8px)
- Padding: 24px
- Hover effect: Slight elevation
- Focus: Visible outline for keyboard navigation

---

## Translation Keys Structure

### Dashboard Page
```json
{
  "dashboard": {
    "title": "dashboard.title",
    "welcome": "dashboard.welcome",
    "project": {
      "name": "dashboard.project.name",
      "label": "dashboard.project.label"
    },
    "cards": {
      "documents": {
        "title": "dashboard.cards.documents.title",
        "summary": {
          "pending": "dashboard.cards.documents.summary.pending",
          "signed": "dashboard.cards.documents.summary.signed",
          "none": "dashboard.cards.documents.summary.none"
        },
        "action": {
          "view": "dashboard.cards.documents.action.view",
          "sign": "dashboard.cards.documents.action.sign"
        }
      },
      "votes": {
        "title": "dashboard.cards.votes.title",
        "summary": {
          "active": "dashboard.cards.votes.summary.active",
          "none": "dashboard.cards.votes.summary.none",
          "voted": "dashboard.cards.votes.summary.voted"
        },
        "action": {
          "view": "dashboard.cards.votes.action.view",
          "vote": "dashboard.cards.votes.action.vote",
          "results": "dashboard.cards.votes.action.results"
        }
      },
      "announcements": {
        "title": "dashboard.cards.announcements.title",
        "summary": {
          "unread": "dashboard.cards.announcements.summary.unread",
          "none": "dashboard.cards.announcements.summary.none"
        },
        "action": {
          "view": "dashboard.cards.announcements.action.view",
          "read": "dashboard.cards.announcements.action.read"
        }
      }
    }
  }
}
```

### Header
```json
{
  "header": {
    "language": {
      "label": "header.language.label",
      "switch": "header.language.switch",
      "hebrew": "header.language.hebrew",
      "arabic": "header.language.arabic",
      "russian": "header.language.russian",
      "english": "header.language.english"
    },
    "profile": {
      "menu": {
        "label": "header.profile.menu.label",
        "profile": "header.profile.menu.profile",
        "settings": "header.profile.menu.settings",
        "logout": "header.profile.menu.logout"
      }
    }
  }
}
```

### Status Badges
```json
{
  "status": {
    "pending": "status.pending",
    "signed": "status.signed",
    "open": "status.open",
    "closed": "status.closed",
    "unread": "status.unread",
    "read": "status.read"
  }
}
```

### Common Actions
```json
{
  "actions": {
    "view": "actions.view",
    "viewAll": "actions.viewAll",
    "sign": "actions.sign",
    "vote": "actions.vote",
    "read": "actions.read",
    "close": "actions.close",
    "cancel": "actions.cancel"
  }
}
```

---

## Accessibility Considerations

### 1. Semantic HTML
- Use `<header>`, `<main>`, `<section>`, `<article>`, `<nav>` appropriately
- Proper heading hierarchy (h1 → h2 → h3)
- Lists for card collections (`<ul>`, `<li>`)

### 2. ARIA Labels
```tsx
<button
  aria-label={t('dashboard.cards.documents.action.view')}
  aria-describedby="documents-summary"
>
  {t('dashboard.cards.documents.action.view')}
</button>
```

### 3. Keyboard Navigation
- All interactive elements focusable
- Tab order: Logical flow (header → cards → actions)
- Enter/Space: Activate buttons
- Escape: Close modals/dropdowns
- Arrow keys: Navigate within lists

### 4. Screen Reader Support
- Live regions for dynamic updates
- Status announcements: "3 pending documents"
- Skip links: "Skip to main content"

### 5. Focus Management
- Visible focus indicators (2px outline, high contrast)
- Focus trap in modals
- Return focus after closing modals

### 6. Color & Contrast
- WCAG AAA: 7:1 contrast ratio
- Don't rely on color alone (use icons + text)
- Status indicators: Color + shape + text

### 7. Touch Targets
- Minimum 44x44px for mobile
- Adequate spacing between interactive elements
- No hover-only interactions on mobile

### 8. RTL Support
```css
[dir="rtl"] {
  /* RTL-specific styles */
  .card {
    text-align: right;
  }
  .header {
    flex-direction: row-reverse;
  }
}
```

### 9. Loading States
- Skeleton screens (not spinners)
- Announce loading: "Loading dashboard data..."
- Error states: Clear, actionable messages

### 10. Form Labels
- Always visible labels (not placeholder-only)
- Error messages: Associated with inputs via `aria-describedby`
- Required fields: Marked with `aria-required`

---

## API Integration Points

### Dashboard Data Fetching
```typescript
// Single API call or parallel calls
const dashboardData = await Promise.all([
  api.get('/api/v1/me/documents'),
  api.get('/api/v1/me/votes'),
  api.get('/api/v1/me/messages'),
]);
```

### Endpoints Used
- `GET /api/v1/me/documents` - Pending documents
- `GET /api/v1/me/votes` - Active votes
- `GET /api/v1/me/messages` - Latest announcements
- `GET /api/v1/me/project` - Project name
- `POST /api/v1/me/messages/:deliveryId/read` - Mark as read

---

## Responsive Breakpoints

```typescript
const breakpoints = {
  mobile: '0px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};
```

### Mobile First Approach
- Base styles: Mobile
- `@media (min-width: 768px)`: Tablet
- `@media (min-width: 1024px)`: Desktop

---

## Performance Considerations

1. **Lazy Loading:**
   - Load card data on demand
   - Code-split routes (Documents, Votes, Messages pages)

2. **Caching:**
   - Cache dashboard data (5-minute TTL)
   - Stale-while-revalidate pattern

3. **Optimistic Updates:**
   - Mark as read immediately (UI)
   - Sync with server in background

4. **Image Optimization:**
   - Avatar images: WebP format, lazy load
   - Icons: SVG sprites

---

## Next Steps

1. **Implementation Order:**
   - Theme & global styles
   - CardBase component
   - Individual cards (Documents, Votes, Announcements)
   - DashboardHeader
   - DashboardPage (composition)
   - i18n setup
   - RTL support
   - Accessibility audit

2. **Testing:**
   - Unit tests: Components
   - Integration tests: API calls
   - E2E tests: User flows
   - Accessibility tests: Screen readers, keyboard navigation

3. **Design System:**
   - Component library (Storybook)
   - Design tokens (colors, spacing, typography)
   - Icon library

---

**Note:** This is a structural document. Actual implementation should follow React/Next.js best practices and the chosen UI library (e.g., Chakra UI, Material-UI, or custom components).
