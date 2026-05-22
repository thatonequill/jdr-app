Got it. Those are crucial distinctions, especially how you’re defining the difference between the **Snapshot (local copy)** and the **Share (in-room broadcast)** features, as well as the room creation roles already present in 1.0.

I have updated the document structure below to accurately reflect your current 1.0 setup and precisely map out those new 2.0 expansions.

---

# CRUX: Product Scope & Version Evolution Document

**Project Stage:** 1.0 Production Wrap / 2.0 Architectural Planning

**Target Systems:** Web (1.0/2.0) & Desktop Client (2.0 Premium)

---

## 1. Executive Summary & Core Pivot

### 1.1 The Crux Vision

Crux began as a friction-free utility tailored for tabletop roleplaying games like _Mage_. The core ethos of version 1.0 is immediate utility: allowing users to self-assign roles upon entry and interact with a structured, 3-card Tarot draw with zero account configuration.

Version 2.0 pivots Crux into a **Modular Virtual Tabletop (VTT) and Campaign Sandbox Ecosystem**. It transitions the application from a single-mechanic, ephemeral space into a persistent, customizable dashboard powered by user accounts, modular interface widgets, advanced drawing mechanics, and a premium power-user desktop client.

---

## 2. High-Level Scope Comparison Matrix

_Use the links in the "Feature Area" column to jump directly to the technical and functional breakdowns for each section._

| Feature Area                                                             | Version 1.0 (Current Baseline)                                                                                | Version 2.0 (Planned Upgrade)                                                                    | Availability Tier (2.0)                                                  |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| **[Authentication & Persistence](#3-authentication--persistence-layer)** | Anonymous access only; temporary, ephemeral rooms. Data wipes on room closure.                                | Secure User Accounts & Authentication. Persistent database sync.                                 | **Free** (Basic) / **Premium** (Advanced)                                |
| **[Room Management & Roles](#4-room--campaign-management)**              | Role assignment choice on entry: Create Room (assigns GM) or Join Room (assigns Player). Ephemeral existence. | Persistent rooms tied to account profiles. GMs can save rooms instead of them vanishing.         | **Free** (2 GM Rooms) / **Premium** (More GM & A Number of Player Rooms) |
| **[Core Mechanic: Tarot Drawing](#5-modular-mechanics-system-core)**     | Fixed 3-card draw sequence with set orientations and rigid order.                                             | Fully customizable draws: pick layout shapes, card counts.                                       | **Free**                                                                 |
| **[Dice & Randomization](#5-modular-mechanics-system-core)**             | None.                                                                                                         | Multi-system dice roller engine widget.                                                          | **Free**                                                                 |
| **[Content Generation Tools](#6-automation--generator-engines)**         | None.                                                                                                         | Systems for generating NPCs, trinkets, items, and quests.                                        | **Free** (Basic) / **Premium** (Dungeons)                                |
| **[Character Sheets](#7-character-sheets--customization)**               | None.                                                                                                         | Digital character sheets with system tracking.                                                   | **Free** (Standard) / **Premium** (Advanced)                             |
| **[User Interface Layout](#7-character-sheets--customization)**          | Rigid, fixed-pane layout focused entirely on the 3-card Tarot canvas.                                         | Fully modular page layout with drag-and-drop widget selection.                                   | **Free** (Web Grid) / **Premium** (Floating Panes)                       |
| **[Snapshots & Sharing](#8-social--sharing-utilities)**                  | Real-time state sync inside active room canvas only.                                                          | **Instant Snapshot** (Copy image to clipboard) vs. **Share Feature** (In-room module broadcast). | **Snapshot is Free** / **Share Broadcast is Premium**                    |
| **[Deployment Channels](#9-deployment-architecture--desktop-client)**    | Web Browser only.                                                                                             | Web Browser + Cross-Platform Desktop Client.                                                     | **Desktop is Premium Exclusive**                                         |
| **[Knowledge Management](#9-deployment-architecture--desktop-client)**   | None.                                                                                                         | Obsidian-style internal note engine with Markdown and Graph View.                                | **Premium Exclusive** (Desktop)                                          |

---

## 3. Authentication & Persistence Layer

### 3.1 Version 1.0 Baseline

- **Access Model:** Zero logins. Users navigate to a dynamically generated URL string or input a room code.
- **Storage Lifecycle:** In-memory / ephemeral. Room state is preserved only as long as active WebSocket connections remain open. Once the last user leaves, the room's history is permanently purged.

### 3.2 Version 2.0 Upgrade

- **Identity Management:** Introduction of secure user accounts (Email/Password & OAuth providers).
- **Persistent Rooms:** Rooms are tied to a database record. GMs and players can close their tabs and return days later to find their layout, histories, and assets completely intact.
- **Storage Tiers:**
- **Free Tier:** GMs get up to 2 active persistent rooms. Players do not get free persistent rooms.
- **Premium Tier:** Unlimited persistent rooms for GMs and players, increased server-side asset storage cache.

---

## 4. Room & Campaign Management

### 4.1 Version 1.0 Baseline

- **Role Assignment:** Upon launching the app, a user chooses to either "Create a Room" (which automatically grants them the **Game Master** role) or "Join a Room" (which automatically grants them the **Player** role).
- **Persistence:** These roles only last for the duration of the ephemeral session.

### 4.2 Version 2.0 Upgrade

- **Persistent GM/Player Roles:** GMs can officially save and label their rooms inside their account dashboard. GMs can invite persistent player accounts, maintaining a static roster across multiple game nights.
- **Player Quick-Rooms:** Players can maintain their own personal, saved rooms for quick play sessions, testing layouts, or managing solo resources without requiring an active GM session.

---

## 5. Modular Mechanics System (Core)

### 5.1 Version 1.0 Baseline

- **Rigid Tarot Engine:** The application is hardcoded around a shared canvas with a singular action: starting a draw. This draw pulls exactly **3 cards in a set orientation and specific order**.

### 5.2 Version 2.0 Upgrade

The system transitions into a **modular canvas workspace** where mechanics become toggleable widgets, and the card engine expands heavily:

- **Advanced Tarot Widget (Expanded):** Breaks away from the rigid 3-card limit. GMs and players can select from pre-set layout shapes (e.g., Celtic Cross, Past/Present/Future spreads) or manually specify the exact number of cards to pull per draw with freeform orientation options.
- **Dice Rolling Engine:** A new core modular widget supporting standard dice notation (d4, d6, d8, d10, d12, d20, d100) alongside custom narrative dice rules (e.g., success counting for Storytelling system games like _Mage_). Includes visual logs of rolls within the room.

---

## 6. Automation & Generator Engines

### 6.1 Version 1.0 Baseline

- Non-existent. All world-building and narrative generation must happen manually outside of the Crux application interface.

### 6.2 Version 2.0 Upgrade

- **Core Narrative Generators (Free):** Integrated side-panels or widgets that pull from curated data matrices to instantaneously generate:
- Non-Player Characters (NPCs) with names, motivations, quirks, and system-appropriate stats.
- Mundane and magical trinkets or item descriptions.
- Quest hooks, complications, and structural themes to bypass GM creative blocks.

- **Procedural Map Generator (Premium):** A premium module that auto-generates randomized dungeon floor plans, grid layouts, or ruin archetypes. Maps can be generated instantly and pushed straight to the room's background layer for active exploration.

---

## 7. Character Sheets & Customization

### 7.1 Version 1.0 Baseline

- No representation of player data or attributes. Character tracking must be handled via paper sheets, PDFs, or external platforms.

### 7.2 Version 2.0 Upgrade

- **Modular Dashboard UI:** The main app interface changes from a rigid layout to an adaptable dashboard. Users can pick and choose precisely which modules (Dice, Cards, Sheets, Generators) are visible on their screen at any given time.
- **Standard Character Sheets (Free):** Functional digital templates allowing players to input attributes, skills, and track vital statistics (health, power pools) directly within their dashboard interface.
- **Advanced & Tailored Character Sheets (Premium):** Highly customizable sheet builders with automated math formulas, macro buttons linking attributes directly to the Dice Engine, visual skinning/themes, and deep interactive system tracking.

---

## 8. Social & Sharing Utilities

### 8.1 Version 1.0 Baseline

- Information exchange is restricted strictly to users physically looking at the active, synchronized shared room canvas.

### 8.2 Version 2.0 Upgrade

- **Instant Snapshot Tool (Free):** A localized rendering button attached to modules (like the Tarot canvas or Dice log). Clicking it captures a clean image of the specific event or draw and copies it directly to the user's local device clipboard for easy pasting into external apps (like Discord or text editors).
- **The "Share" Feature (Premium Exclusive):** An active, synchronized notification and display system. When a premium user triggers a "Share," it forcefully or prominently broadcasts that specific event/draw/roll layout to everyone currently connected to the room inside a dedicated spotlight module, ensuring no one misses a major narrative moment.

---

## 9. Deployment Architecture & Desktop Client

### 9.1 Version 1.0 Baseline

- **Platform:** Web-only interface accessible via modern desktop and mobile browsers.

### 9.2 Version 2.0 Upgrade

While the web application receives substantial upgrades, a separate, native **Desktop Client** (built via frameworks like Electron or Tauri) will launch exclusively as a premium-tier product offering advanced capabilities.

- **Advanced Layout Engine (Desktop Premium):**
- Breaks away from single-browser tab boundaries.
- Supports true **floating, independent windows** allowing multi-monitor users to pin their character sheet to one screen, note engines to another, and the primary shared Tarot room to a central display.

- **Knowledge Base Engine (Desktop Premium):**
- An integrated **Obsidian-style note-taking environment** leveraging markdown files.
- **Interlinked Entries:** Allows users to link notes together using bidirectional page references (e.g., [[NPC Name]]).
- **Interactive Graph View:** Displays an evolving visual node network map showing the relationships and structural connections between NPCs, locations, clues, and campaign events.

- **Sync & Storage Strategy:**
- **Local-Only Option:** Complete privacy controls allowing users to save campaigns, graphics, notes, and session logs locally on their machine without ever hitting cloud servers.
- **Cloud Sync:** Automated background synchronization with cloud storage. Includes a seamless utility to convert canvas outcomes (like an impactful card draw) straight into a markdown note file with one click.
