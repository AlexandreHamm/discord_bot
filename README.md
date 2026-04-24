# 🤖 Discord Clan Bot

This is a custom Discord bot built for managing a clan and its community.

It provides a clean, automated, and scalable system for:
- Recruitment (applications → review → decision)
- Staff workflow
- Server setup (rules, panels)
- Future expansion (events, onboarding, personas)

---

## 🚀 Features (Current)

### 📩 Recruitment System
- Application panel
- Button → Modal → Submission flow
- Forum-based application tracking
- Automatic thread creation per application

### 🧾 Application Handling
- `/accept`
  - Assigns clan role
  - Updates application embed (Accepted)
  - Sends DM to applicant
  - Locks & archives thread

- `/reject`
  - Updates embed (Rejected + reason)
  - Sends DM to applicant
  - Locks & archives thread

### 🛑 Safeguards
- Prevent duplicate applications (by user ID)
- Prevent double decisions (accept/reject twice)
- Graceful error handling (no crashes if DMs closed)

### 🧠 Persona System
- Uses Discord webhooks for clean system messages
- Current persona:
  - **I.S.A.C** (system / official messages)

### 📜 Server Setup
- `/setup-applications` → posts recruitment panel
- `/setup-rules` → posts server rules

---

## 🏗️ Architecture

```txt
src/
├─ commands/
│  ├─ setup/
│  ├─ staff/
│  └─ utility/
├─ config/
├─ discord/
├─ personas/
├─ interactions/
│  ├─ buttons/
│  └─ modals/
└─ webhooks/
```

---

## Key Concepts
- Commands → Slash commands (/accept, /reject, etc.)
- Interactions → Buttons & modals
- Personas → Webhook-based message identity
- Forum threads → Used as application records

---

## ⚙️ Setup

### 1. Environment variables

- Create .env:

```txt
DISCORD_TOKEN=YOUR_BOT_TOKEN
DISCORD_CLIENT_ID=YOUR_APP_ID
DISCORD_GUILD_ID=YOUR_SERVER_ID
CLAN_MEMBER_ROLE_ID=YOUR_ROLE_ID
```

### 2. Install dependencies
- `npm install`

### 3. Deploy commands
- `npm run deploy:commands`

### 4. Start bot
- `npm run dev`

---

## 🔐 Required Permissions

- Bot must have:

  - Manage Roles
  - Manage Webhooks
  - Manage Threads
  - Send Messages
  - Embed Links
  - Read Message History

- And:

  - Bot role must be above roles it assigns

---

## 📌 Current Limitations

- No database (data stored in Discord only)
- Application tracking based on thread names + embeds
- Single-platform recruitment (PC only)
- No logging system (intentional for now)

---

## 🧭 Roadmap (Next Ideas)
- Onboarding system (Discord native)
- Welcome / info panels
- Additional personas (A.N.N.A / DIAMOND)
- Event system (raids, DZ, etc.)
- Optional logging system
- Database integration (advanced)

---

## 🧠 Philosophy

- This bot is designed to be:

  - Clean (no clutter, no spam)
  - Scalable (modular structure)
  - Invisible (system-driven, not staff-driven)
  - Efficient (minimal friction for users)

---

## 👤 Author

- Built by: github/AlexandreHamm