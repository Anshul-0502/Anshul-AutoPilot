import DataMigration from '../models/DataMigration.js';
import StudySession from '../models/StudySession.js';
import StudyNote from '../models/StudyNote.js';
import StudyPdf from '../models/StudyPdf.js';
import StudyRevision from '../models/StudyRevision.js';
import CodingLanguage from '../models/CodingLanguage.js';
import DSAProblem from '../models/DSAProblem.js';
import CodingSession from '../models/CodingSession.js';
import CodingNote from '../models/CodingNote.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import PlannerEvent from '../models/PlannerEvent.js';
import WaterLog from '../models/WaterLog.js';
import SleepLog from '../models/SleepLog.js';
import Workout from '../models/Workout.js';
import Habit from '../models/Habit.js';
import UserPreferences from '../models/UserPreferences.js';

import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get data migration status for the user
// @route   GET /api/v1/migration/status
// @access  Private
export const getMigrationStatus = asyncHandler(async (req, res) => {
  let migration = await DataMigration.findOne({ userId: req.user._id });

  res.status(200).json({
    success: true,
    data: {
      migrated: migration ? (migration.status === 'completed') : false,
      status: migration ? migration.status : 'pending',
      importedCounts: migration ? migration.importedCounts : {},
      completedAt: migration ? migration.completedAt : null
    }
  });
});

// @desc    Import legacy LocalStorage data payload to MongoDB
// @route   POST /api/v1/migration/import
// @access  Private
export const importLegacyData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { data } = req.body;

  if (!data || typeof data !== 'object') {
    res.status(400);
    throw new Error('Valid LocalStorage data payload is required.');
  }

  // Check if already migrated
  let migration = await DataMigration.findOne({ userId });
  if (migration && migration.status === 'completed') {
    return res.status(200).json({
      success: true,
      message: 'Migration has already been completed for this user account.',
      data: {
        migrated: true,
        importedCounts: migration.importedCounts
      }
    });
  }

  if (!migration) {
    migration = new DataMigration({ userId, status: 'pending' });
  }

  const counts = {
    studySessions: 0,
    studyNotes: 0,
    studyPdfs: 0,
    studyRevisions: 0,
    languages: 0,
    problems: 0,
    codingSessions: 0,
    codingNotes: 0,
    projects: 0,
    tasks: 0,
    plannerEvents: 0,
    waterLogs: 0,
    sleepLogs: 0,
    workouts: 0,
    habits: 0
  };

  try {
    // 1. Preferences Merge
    if (data['anshul_autopilot_settings_data']) {
      try {
        const legacyPrefs = JSON.parse(data['anshul_autopilot_settings_data']);
        let dbPrefs = await UserPreferences.findOne({ userId });
        if (!dbPrefs) {
          dbPrefs = new UserPreferences({ userId });
        }
        
        // Merge safe nested categories
        const categories = ['appearance', 'dashboard', 'notifications', 'study', 'coding', 'timer', 'security'];
        for (const cat of categories) {
          if (legacyPrefs[cat] && typeof legacyPrefs[cat] === 'object') {
            dbPrefs[cat] = {
              ...dbPrefs[cat]?.toObject(),
              ...legacyPrefs[cat]
            };
          }
        }
        await dbPrefs.save();
      } catch (prefErr) {
        console.error('[Migration preferences parse failed]', prefErr.message);
      }
    }

    // 2. Study Sessions
    if (data['autopilot-study-sessions']) {
      try {
        const sessionsList = JSON.parse(data['autopilot-study-sessions']);
        if (Array.isArray(sessionsList)) {
          for (const s of sessionsList) {
            const dateStr = s.date || new Date().toISOString().split('T')[0];
            const durationSecs = s.durationSeconds || (s.durationMinutes * 60) || 1500;
            const durationText = s.durationText || `${(durationSecs / 3600).toFixed(1)}h`;
            
            const exists = await StudySession.findOne({
              userId,
              subject: s.subject,
              date: dateStr,
              durationSeconds: durationSecs
            });

            if (!exists) {
              await StudySession.create({
                userId,
                subject: s.subject || 'General',
                type: s.type || 'Practice',
                durationSeconds: durationSecs,
                durationText: durationText,
                date: dateStr
              });
              counts.studySessions++;
            }
          }
        }
      } catch (err) {
        console.error('[Study sessions migration failed]', err.message);
      }
    }

    // 3. Study Notes
    if (data['autopilot-study-notes']) {
      try {
        const notesList = JSON.parse(data['autopilot-study-notes']);
        if (Array.isArray(notesList)) {
          for (const n of notesList) {
            const titleStr = n.title || 'Untitled Note';
            const subjectStr = n.subject || 'General';
            
            const exists = await StudyNote.findOne({
              userId,
              title: titleStr,
              subject: subjectStr
            });

            if (!exists) {
              await StudyNote.create({
                userId,
                title: titleStr,
                subject: subjectStr,
                content: n.content || '',
                tags: n.tags || [],
                pinned: !!n.pinned,
                favorite: !!n.favorite
              });
              counts.studyNotes++;
            }
          }
        }
      } catch (err) {
        console.error('[Study notes migration failed]', err.message);
      }
    }

    // 4. Study PDFs
    if (data['autopilot-study-pdfs']) {
      try {
        const pdfsList = JSON.parse(data['autopilot-study-pdfs']);
        if (Array.isArray(pdfsList)) {
          for (const p of pdfsList) {
            const exists = await StudyPdf.findOne({
              userId,
              title: p.title
            });
            if (!exists) {
              await StudyPdf.create({
                userId,
                id: p.id || `pdf_${Date.now()}_${Math.random()}`,
                title: p.title || 'Book PDF',
                fileName: p.fileName || '',
                filePath: p.filePath || '',
                fileSize: p.fileSize || '0 KB',
                uploadedAt: p.uploadedAt || new Date().toISOString()
              });
              counts.studyPdfs++;
            }
          }
        }
      } catch (err) {
        console.error('[Study PDFs migration failed]', err.message);
      }
    }

    // 5. Study Revisions
    if (data['autopilot-study-revisions']) {
      try {
        const revsList = JSON.parse(data['autopilot-study-revisions']);
        if (Array.isArray(revsList)) {
          for (const r of revsList) {
            const exists = await StudyRevision.findOne({
              userId,
              title: r.title,
              subject: r.subject
            });
            if (!exists) {
              await StudyRevision.create({
                userId,
                id: r.id || `rev_${Date.now()}_${Math.random()}`,
                title: r.title || 'Revise Item',
                subject: r.subject || 'General',
                dueDate: r.dueDate || '',
                status: r.status || 'Pending',
                intervalDays: r.intervalDays || 1,
                repetitions: r.repetitions || 0,
                easeFactor: r.easeFactor || 2.5
              });
              counts.studyRevisions++;
            }
          }
        }
      } catch (err) {
        console.error('[Study Revisions migration failed]', err.message);
      }
    }

    // 6. Coding Workspace (languages, problems, sessions, notes)
    if (data['anshul_autopilot_coding_data']) {
      try {
        const codingObj = JSON.parse(data['anshul_autopilot_coding_data']);
        
        // A. Languages
        if (codingObj.languages && Array.isArray(codingObj.languages)) {
          for (const l of codingObj.languages) {
            const exists = await CodingLanguage.findOne({ userId, name: l.name });
            if (!exists) {
              await CodingLanguage.create({
                userId,
                name: l.name,
                progress: l.progress || 0,
                status: l.status || 'active'
              });
              counts.languages++;
            }
          }
        }

        // B. Problems
        if (codingObj.problems && Array.isArray(codingObj.problems)) {
          for (const p of codingObj.problems) {
            const nameStr = p.name || p.title;
            const exists = await DSAProblem.findOne({ userId, name: nameStr });
            if (!exists) {
              await DSAProblem.create({
                userId,
                id: p.id || `prob_${Date.now()}_${Math.random()}`,
                name: nameStr || 'Untitled Problem',
                difficulty: p.difficulty || 'Easy',
                status: p.status || 'Solved',
                language: p.language || 'JavaScript',
                dateLogged: p.dateLogged || new Date().toISOString().split('T')[0]
              });
              counts.problems++;
            }
          }
        }

        // C. Coding Sessions
        if (codingObj.sessions && Array.isArray(codingObj.sessions)) {
          for (const s of codingObj.sessions) {
            const exists = await CodingSession.findOne({
              userId,
              date: s.date,
              durationMinutes: s.durationMinutes
            });
            if (!exists) {
              await CodingSession.create({
                userId,
                type: s.type || 'Practice',
                durationMinutes: s.durationMinutes || 30,
                date: s.date || new Date().toISOString().split('T')[0]
              });
              counts.codingSessions++;
            }
          }
        }

        // D. Coding Notes
        if (codingObj.notes && Array.isArray(codingObj.notes)) {
          for (const n of codingObj.notes) {
            const exists = await CodingNote.findOne({
              userId,
              title: n.title,
              date: n.date
            });
            if (!exists) {
              await CodingNote.create({
                userId,
                title: n.title || 'Coding Note',
                content: n.content || '',
                lang: n.lang || 'General',
                tags: n.tags || [],
                codeSnippet: n.codeSnippet || '',
                favorite: !!n.favorite,
                date: n.date || new Date().toISOString().split('T')[0]
              });
              counts.codingNotes++;
            }
          }
        }
      } catch (err) {
        console.error('[Coding data migration failed]', err.message);
      }
    }

    // 7. Projects
    if (data['anshul_autopilot_projects_data']) {
      try {
        const projectsList = JSON.parse(data['anshul_autopilot_projects_data']);
        if (Array.isArray(projectsList)) {
          for (const p of projectsList) {
            const exists = await Project.findOne({ userId, name: p.name });
            if (!exists) {
              await Project.create({
                userId,
                name: p.name || 'Untitled Project',
                description: p.description || '',
                category: p.category || 'General',
                techStack: p.techStack || [],
                startDate: p.startDate || '',
                deadline: p.deadline || '',
                priority: p.priority || 'Medium',
                status: p.status || 'In Progress',
                version: p.version || 'v1.0.0',
                progress: p.progress || 0,
                tasks: (p.tasks || []).map(t => ({
                  id: t.id || `t_${Date.now()}_${Math.random()}`,
                  title: t.title || 'Project Task',
                  description: t.description || '',
                  priority: t.priority || 'Medium',
                  deadline: t.deadline || '',
                  status: t.status || 'todo',
                  subtasks: t.subtasks || []
                })),
                milestones: (p.milestones || []).map(m => ({
                  id: m.id || `m_${Date.now()}_${Math.random()}`,
                  title: m.title || 'Project Milestone',
                  dueDate: m.dueDate || '',
                  status: m.status || 'pending',
                  progress: m.progress || 0
                })),
                docs: (p.docs || []).map(d => ({
                  id: d.id || `d_${Date.now()}_${Math.random()}`,
                  type: d.type || '',
                  content: d.content || ''
                })),
                resources: (p.resources || []).map(r => ({
                  id: r.id || `r_${Date.now()}_${Math.random()}`,
                  name: r.name || 'Link',
                  type: r.type || '',
                  url: r.url || ''
                })),
                bugs: (p.bugs || []).map(b => ({
                  id: b.id || `b_${Date.now()}_${Math.random()}`,
                  title: b.title || 'Bug report',
                  description: b.description || '',
                  severity: b.severity || 'Minor',
                  module: b.module || '',
                  status: b.status || 'In Progress',
                  date: b.date || ''
                })),
                deployments: (p.deployments || []).map(d => ({
                  id: d.id || `dep_${Date.now()}_${Math.random()}`,
                  env: d.env || '',
                  platform: d.platform || '',
                  url: d.url || '',
                  version: d.version || '',
                  date: d.date || ''
                })),
                releases: (p.releases || []).map(r => ({
                  id: r.id || `rel_${Date.now()}_${Math.random()}`,
                  version: r.version || 'v1.0.0',
                  date: r.date || '',
                  releaseNotes: r.releaseNotes || ''
                }))
              });
              counts.projects++;
            }
          }
        }
      } catch (err) {
        console.error('[Projects migration failed]', err.message);
      }
    }

    // 8. Tasks (independent task model list)
    if (data['anshul_autopilot_tasks_data_cache'] || data['anshul_autopilot_tasks_data']) {
      try {
        const rawTasks = data['anshul_autopilot_tasks_data_cache'] || data['anshul_autopilot_tasks_data'];
        const tasksList = JSON.parse(rawTasks);
        if (Array.isArray(tasksList)) {
          for (const t of tasksList) {
            const exists = await Task.findOne({ userId, title: t.title, deadline: t.deadline });
            if (!exists) {
              await Task.create({
                userId,
                id: t.id || `task_${Date.now()}_${Math.random()}`,
                title: t.title || 'Untitled Task',
                description: t.description || 'Task migrated.',
                priority: t.priority || 'Medium',
                category: t.category || 'General',
                deadline: t.deadline || '',
                completed: !!t.completed,
                completedAt: t.completedAt || null,
                subtasks: t.subtasks || []
              });
              counts.tasks++;
            }
          }
        }
      } catch (err) {
        console.error('[Independent Tasks migration failed]', err.message);
      }
    }

    // 9. Planner Events
    if (data['anshul_autopilot_planner_events']) {
      try {
        const eventsList = JSON.parse(data['anshul_autopilot_planner_events']);
        if (Array.isArray(eventsList)) {
          for (const e of eventsList) {
            const exists = await PlannerEvent.findOne({
              userId,
              title: e.title,
              date: e.date,
              time: e.time
            });
            if (!exists) {
              await PlannerEvent.create({
                userId,
                id: e.id || `event_${Date.now()}_${Math.random()}`,
                title: e.title || 'Planner Event',
                description: e.description || '',
                date: e.date || new Date().toISOString().split('T')[0],
                time: e.time || '12:00',
                duration: e.duration || 60,
                category: e.category || 'Study',
                completed: !!e.completed
              });
              counts.plannerEvents++;
            }
          }
        }
      } catch (err) {
        console.error('[Planner Events migration failed]', err.message);
      }
    }

    // 10. Health and Habits Data
    if (data['anshul_autopilot_health_data']) {
      try {
        const healthObj = JSON.parse(data['anshul_autopilot_health_data']);
        
        // A. Water Logs
        if (healthObj.waterLogs && Array.isArray(healthObj.waterLogs)) {
          for (const w of healthObj.waterLogs) {
            const exists = await WaterLog.findOne({ userId, date: w.date });
            if (!exists) {
              await WaterLog.create({
                userId,
                date: w.date || new Date().toISOString().split('T')[0],
                intake: w.intake || 0
              });
              counts.waterLogs++;
            }
          }
        }

        // B. Sleep Logs
        if (healthObj.sleepLogs && Array.isArray(healthObj.sleepLogs)) {
          for (const s of healthObj.sleepLogs) {
            const exists = await SleepLog.findOne({ userId, date: s.date });
            if (!exists) {
              await SleepLog.create({
                userId,
                id: s.id || `sleep_${Date.now()}_${Math.random()}`,
                date: s.date || new Date().toISOString().split('T')[0],
                day: s.day || 'Friday',
                hours: s.hours || 7
              });
              counts.sleepLogs++;
            }
          }
        }

        // C. Workouts
        if (healthObj.workouts && Array.isArray(healthObj.workouts)) {
          for (const w of healthObj.workouts) {
            const exists = await Workout.findOne({ userId, date: w.date, id: w.id });
            if (!exists) {
              await Workout.create({
                userId,
                id: w.id || `work_${Date.now()}_${Math.random()}`,
                type: w.type || 'Cardio',
                duration: w.duration || 30,
                calories: w.calories || 150,
                status: w.status || 'Completed',
                notes: w.notes || '',
                date: w.date || new Date().toISOString().split('T')[0]
              });
              counts.workouts++;
            }
          }
        }

        // D. Habits
        if (healthObj.habits && Array.isArray(healthObj.habits)) {
          for (const h of healthObj.habits) {
            const exists = await Habit.findOne({ userId, title: h.title });
            if (!exists) {
              // Convert history array to Map of booleans
              const historyMap = new Map();
              if (Array.isArray(h.history)) {
                h.history.forEach(dateStr => historyMap.set(dateStr, true));
              } else if (h.history && typeof h.history === 'object') {
                Object.entries(h.history).forEach(([dateStr, completed]) => historyMap.set(dateStr, !!completed));
              }

              await Habit.create({
                userId,
                id: h.id || `habit_${Date.now()}_${Math.random()}`,
                title: h.title || 'Habit',
                category: h.category || 'health',
                streak: h.streak || 0,
                history: historyMap
              });
              counts.habits++;
            }
          }
        }
      } catch (err) {
        console.error('[Health data migration failed]', err.message);
      }
    }

    // Mark migration completed
    migration.status = 'completed';
    migration.importedCounts = counts;
    migration.completedAt = new Date();
    await migration.save();

    res.status(200).json({
      success: true,
      message: 'Legacy LocalStorage data successfully migrated to MongoDB! 🎉',
      data: {
        migrated: true,
        importedCounts: counts
      }
    });

  } catch (err) {
    migration.status = 'failed';
    await migration.save();
    res.status(500);
    throw new Error(`Migration process crashed: ${err.message}`);
  }
});
