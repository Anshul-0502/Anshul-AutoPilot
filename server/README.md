# Anshul AutoPilot Backend Server

This is the Node.js + Express backend server for Anshul AutoPilot. It provides REST API services for managing authentication, tasks, planner events, study notes, coding logs, project tracking, skill arena XP/achievements, habits, notifications, settings, and AI conversations.

## 📁 Folder Architecture

```
server/
├── src/
│   ├── config/
│   │   ├── env.js            # Environment validation and configurations
│   │   └── database.js       # MongoDB connection configuration and lifecycle events
│   ├── middleware/
│   │   ├── errorHandler.js   # Centralized error formatter
│   │   ├── notFound.js       # Unmatched route (404) helper
│   │   └── requestLogger.js  # HTTP request logger using Morgan
│   ├── routes/
│   │   └── index.js          # Centralized route registry with dynamic database status checks
│   ├── utils/
│   │   ├── ApiError.js       # Custom API error utility class
│   │   └── asyncHandler.js   # Controller handler wrapper for promise catches
│   ├── app.js                # Express app setup and middleware configuration
│   └── server.js             # HTTP server entry point and process lifecycle
├── .env                      # Local development secrets
├── .env.example              # Sample environment file template
├── package.json              # Backend dependencies and startup scripts
└── README.md                 # Project documentation
```

## ⚙️ Environment Configurations

Create a `.env` file at the root of the `server/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/anshul_autopilot
CLIENT_URL=http://localhost:5173
```

## 💾 MongoDB Requirements & Setup

* **Local MongoDB Instance**: Running locally on port `27017` (default).
* **Database Name**: `anshul_autopilot` (for development/local).
* **GUI Inspection**: Use [MongoDB Compass](https://www.mongodb.com/products/compass) connecting to `mongodb://127.0.0.1:27017` to inspect database collections.

## 📐 Data Standardization Standards

### 1. ID Strategy
* All MongoDB documents will use the standard `_id` (ObjectId) field as their primary identifier.
* During migration phases, existing client-side `Date.now()` or numeric IDs will be serialized/mapped to `_id` on the backend, or vice versa, to preserve frontend compatibility without breaking visual layouts.

### 2. Date Storage Standard
* Real JavaScript Date / BSON Date values must be used in MongoDB documents for timestamps (e.g., `createdAt`, `updatedAt`, `deadline`, `sessionStart`).
* Avoid storing relative or pre-formatted date strings (e.g., "Yesterday", "8/13/2026"). Date formatting and translation should happen exclusively in frontend presentation components.

### 3. User Ownership
* To support authentication (Phase 3+), future collections will enforce a `userId` field linking resources to their authenticated owners. Plain text or untrusted client headers will not be accepted for identity checks.

### 4. Database Collection Naming
* Collection names must be plural and lowercase:
  * `users`
  * `tasks`
  * `planner_events`
  * `study_subjects`, `study_notes`, `study_sessions`
  * `coding_problems`, `coding_sessions`
  * `projects`
  * `skill_profiles`
  * `health_records`
  * `notifications`
  * `user_settings`
  * `ai_conversations`

## 🚀 Running the Server

Run dependencies installation inside `/server`:
```bash
npm install
```

Start the local API development server with live reload:
```bash
npm run dev
```

Run in production mode:
```bash
npm start
```

## 🔌 API Endpoints

### Health Check

Check if the API server is functional and connected:

* **URL**: `/api/v1/health`
* **Method**: `GET`
* **Response format**:
```json
{
  "success": true,
  "message": "Anshul AutoPilot API is running",
  "data": {
    "api": "connected",
    "database": "connected",
    "environment": "development",
    "timestamp": "2026-08-27T16:00:00.000Z",
    "version": "1.0.0"
  }
}
```

## 🔎 Common Connection Troubleshooting

* **Error: `connect ECONNREFUSED 127.0.0.1:27017`**
  * **Meaning**: The local MongoDB server is not running or listening.
  * **Solution**: Run `Start-Service -Name MongoDB` in Windows Administrator PowerShell or start MongoDB via the Services panel.
* **Error: `MONGODB_URI is undefined / invalid`**
  * **Meaning**: Environment configuration failed to load.
  * **Solution**: Verify that `server/.env` exists and contains the `MONGODB_URI` definition.
