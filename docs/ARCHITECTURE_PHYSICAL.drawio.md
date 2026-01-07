# How to Open ARCHITECTURE_PHYSICAL.drawio

This file contains physical architecture diagrams in **diagrams.net** (formerly draw.io) format.

## Opening the File

### Option 1: Online (Recommended)
1. Go to [https://app.diagrams.net/](https://app.diagrams.net/) (or [https://draw.io](https://draw.io))
2. Click **"Open Existing Diagram"**
3. Select **"Device"** tab
4. Click **"Choose"** and select `docs/ARCHITECTURE_PHYSICAL.drawio`
5. The file will open with all pages available

### Option 2: Desktop App
1. Download diagrams.net desktop app from [https://github.com/jgraph/drawio-desktop/releases](https://github.com/jgraph/drawio-desktop/releases)
2. Install and open the application
3. File → Open → Select `docs/ARCHITECTURE_PHYSICAL.drawio`

### Option 3: VS Code Extension
1. Install "Draw.io Integration" extension in VS Code
2. Open `docs/ARCHITECTURE_PHYSICAL.drawio` in VS Code
3. The file will open in the integrated editor

## File Structure

The `.drawio` file contains **7 pages**, each corresponding to a diagram in `ARCHITECTURE_PHYSICAL.md`:

1. **1. C4 Level 1 - System Context** - External actors and system boundary
2. **2. C4 Level 2 - Containers** - Main containers (Frontend, Backend, DB, Storage, Jobs, Audit)
3. **3. C4 Level 3 - Backend Components** - NestJS modules and dependencies
4. **4. Database Physical ERD** - Database schema with tables, relationships, RLS, triggers
5. **5.1 Document Flow** - Sequence diagram for document upload, assign, download, sign
6. **5.2 Voting Flow** - Sequence diagram for vote creation, voting, results
7. **5.3 Download Token Validation Flow** - Sequence diagram for token generation and validation

## Navigating Pages

- **Bottom of editor:** Use page tabs to switch between diagrams
- **Right panel:** Page list view (if enabled)
- **File menu:** View → Pages to see all pages

## Editing

- All diagrams are editable in diagrams.net
- Changes are saved back to the `.drawio` file
- Use layers and groups for complex diagrams
- Export options: PNG, SVG, PDF, etc.

## Notes

- Diagrams use real module/controller/service names from the codebase
- Security boundaries are marked with colored borders and labels
- Trust boundaries (JWT, RLS, Public endpoints) are explicitly labeled
- Assumptions are documented in the corresponding Markdown file

---

**File:** `docs/ARCHITECTURE_PHYSICAL.drawio`  
**Format:** diagrams.net XML  
**Pages:** 7  
**Last Updated:** Based on current codebase state
