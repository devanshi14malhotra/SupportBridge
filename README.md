# SupportBridge

SupportBridge is a student-support triage application. It helps a student explain what is happening in plain language, understand possible support routes, review why those routes were suggested, and choose what to do next.

The app is designed around consent and explainability: students can see the evidence behind a recommendation, decide whether to share it, and return to a shared support plan. It is a demo using synthetic data, not a production student-record system.

## Features

- Student story entry with guided support prompts
- Explainable recommendations with evidence and confidence
- Consent-aware referral review
- Support options for financial, housing, academic, wellbeing, accessibility, health, work, international, advocacy, food, and community needs
- Urgent safety and crisis-support paths
- Case tracking after a student creates a support request
- Staff inbox and case detail views
- Coordinator overview and on-call safety views
- Notes, referral updates, rerouting, alerts, audit history, and case resolution
- Responsive interface for desktop and mobile layouts

## Run Locally

Requirements:

- Node.js 22 or newer
- npm

From the project root:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173` in a browser.

To use another port in PowerShell:

```powershell
$env:PORT="5174"
npm run dev
```

## Verification

```powershell
npm run typecheck
npm run build
```

## Routes

- `/` - student welcome page
- `/chat` - student story and triage flow
- `/crisis` - urgent support page
- `/track/:caseId` - case tracking
- `/person` - talk-to-a-person options
- `/staff` - staff inbox
- `/staff/case/:id` - staff case view
- `/coordinator` - coordinator workspace
- `/oncall` - on-call safety alerts
- `/overview` - support overview

## Project Structure

```text
artifacts/supportbridge/
  src/
    components/     Shared application and UI components
    data/            Synthetic support cases and in-memory state
    pages/           Student, staff, coordinator, and on-call screens
    App.tsx         Application routing and providers
    index.css       Application theme and styles
  index.html        Browser entry point
  package.json      Frontend dependencies and scripts
  vite.config.ts    Vite development and production configuration
scripts/dev.mjs     Root npm launcher for the frontend
```

## Data and Privacy

The current demo stores state in memory in the browser. It does not connect to a database or external student-support service. Refreshing the page resets locally created demo changes. Do not enter real student information.

## Safety Notice

SupportBridge is a demonstration interface. If someone is in immediate danger, contact local emergency services or the appropriate crisis service in their location.
