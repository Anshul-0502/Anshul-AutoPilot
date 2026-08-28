# 📢 Anshul AutoPilot v2.0.0 — Official Release Notes

Anshul AutoPilot is a unified academic productivity workspace and brain training engine. It is designed to combine daily scheduling, task boards, study logs, coding compilers, project milestones, gamified challenges, and physical health tracking into one cohesive interface.

This v2.0.0 release marks the complete delivery of all Planned Modules (Phases 1 through 14) following the verified stable build.

---

## 🌟 Feature Summary Matrices

### 1. Productivity & Planning
- **Overview Dashboard**: Unified cockpit aggregating today's focus goals, urgent task counts, and streaks.
- **Smart Tasks Board**: Multi-category task lists with priority rankings (Critical, High, Medium, Low) and target deadlines.
- **Planner Calendar**: Timeblock schedules for subject study sessions.

### 2. Study Hub & Resource Library
- **Notes Manager**: Create and organize revision notes directly in browser client storage.
- **PDF Library**: Register book resources and track reading completion progress.
- **Concept Revisions**: Set active intervals to recap completed subjects.

### 3. Coding Workspace
- **Mock IDE Compilers**: Write and solve competitive programming DSA problems in Python, JavaScript, and C++.
- **DSA solved trackers**: Daily solved goal lines and overall progress metrics.

### 4. Skill Arena (Learning Games Hub)
- **Code Arena**: Interactive multiple-choice predictors.
- **Quiz Arena**: Interval countdown-guarded technology trivia.
- **Logic Arena**: Memory Card matching grids and place-value Binary sum togglers.
- **Brain Challenge Hub**: Reaction speed delay checkers and fast-paced Visual Math sprints.
- **Missions & Roadmap**: Gamified achievements unlocking Coins and XP rewards.

### 5. Health & Focus Hub
- **Water counter**: Visual SVG glass visualizer dynamically filling upon logging cups.
- **Sleep history**: Set overnight bedtimes and compute sleep quality grades.
- **Workout logs**: Save minutes spent on walking, gym, or yoga sessions alongside manual calorie totals.
- **Guided Meditation**: Guided box breathing exercises (4-4-4-4 cycle) with expanding circle animators and chime tones.
- **Pomodoro & Focus Timers**: Countdown ticking clock and auto-start rest periods that sync completed sessions with Skill Arena XP scores.

### 6. Central Analytics & Customizations
- **Productivity Scoring**: Composites a daily score (0 to 100) awarding ranks from Bronze to Diamond.
- **SVG Charts Library**: Beautiful vector Line, Bar, Doughnut, and Heatmap components.
- **Personalized Configuration**: Edit profile bios, choose preset tech avatar designs, and select appearance accent color overrides.
- **Local backups**: Import and export database tables using local JSON files.

---

## ⚙️ Installation & Running Guide

### System Requirements
- Node.js (v18 or higher recommended)
- Browser client memory (HTML5 LocalStorage enabled)

### Setup Commands
1. Clone or extract the repository directory.
2. In your terminal, install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To launch the local development server:
```bash
npm run dev
```

### Windows Security Policy Bypass
Running shell command scripts may fail on Windows systems due to disabled executing policies (`PSSecurityException`). Bypass this by launching commands directly through command prompt (`cmd.exe`), for example:
- Launch production build:
  ```cmd
  cmd.exe /c "npm run build"
  ```
- Launch local test server:
  ```cmd
  cmd.exe /c "npm run dev"
  ```

---

## 🔮 Future Version Roadmap (Version 3.0)
- **Anti Gravity AI Integration**: Programmatic context-aware chat assistants, intelligent automatic scheduling, and notes synthesis summaries.
- **Cloud Synchronization**: Multi-device database sync and workspace collaboration tracks.
- **Google Integrations**: Direct sync with Google Drive, Gmail notifications, and Google Calendar reminders.
