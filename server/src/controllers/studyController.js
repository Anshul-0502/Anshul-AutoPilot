import StudySubject from '../models/StudySubject.js';
import StudyNote from '../models/StudyNote.js';
import StudyPdf from '../models/StudyPdf.js';
import StudyResource from '../models/StudyResource.js';
import StudyCourse from '../models/StudyCourse.js';
import StudyRevision from '../models/StudyRevision.js';
import StudySession from '../models/StudySession.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// --- SUBJECTS ---
export const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await StudySubject.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: { subjects } });
});

export const createSubject = asyncHandler(async (req, res) => {
  const { name, description, color, studyGoal, progress, favorite } = req.body;
  if (!name) throw new ApiError(400, 'Subject name is required');

  const subject = await StudySubject.create({
    userId: req.user._id,
    name,
    description: description || '',
    color: color || 'blue',
    studyGoal: studyGoal || '2h/week',
    progress: progress || 0,
    favorite: !!favorite
  });
  res.status(201).json({ success: true, data: { subject } });
});

export const updateSubject = asyncHandler(async (req, res) => {
  const subject = await StudySubject.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!subject) throw new ApiError(404, 'Subject not found');
  res.status(200).json({ success: true, data: { subject } });
});

export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await StudySubject.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!subject) throw new ApiError(404, 'Subject not found');
  res.status(200).json({ success: true, message: 'Subject deleted successfully' });
});

// --- NOTES ---
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await StudyNote.find({ userId: req.user._id }).sort({ pinned: -1, updatedAt: -1 });
  res.status(200).json({ success: true, data: { notes } });
});

export const createNote = asyncHandler(async (req, res) => {
  const { title, subject, content, tags, pinned, favorite } = req.body;
  if (!title || !subject) throw new ApiError(400, 'Title and subject are required');

  const note = await StudyNote.create({
    userId: req.user._id,
    title,
    subject,
    content: content || '',
    tags: tags || [],
    pinned: !!pinned,
    favorite: !!favorite
  });
  res.status(201).json({ success: true, data: { note } });
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await StudyNote.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!note) throw new ApiError(404, 'Note not found');
  res.status(200).json({ success: true, data: { note } });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await StudyNote.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!note) throw new ApiError(404, 'Note not found');
  res.status(200).json({ success: true, message: 'Note deleted successfully' });
});

// --- PDF LIBRARY ---
export const getPdfs = asyncHandler(async (req, res) => {
  const pdfs = await StudyPdf.find({ userId: req.user._id }).sort({ updatedAt: -1 });
  res.status(200).json({ success: true, data: { pdfs } });
});

export const createPdf = asyncHandler(async (req, res) => {
  const { title, subject, currentPage, totalPages, lastOpened } = req.body;
  if (!title || !subject) throw new ApiError(400, 'Title and subject are required');

  const pdf = await StudyPdf.create({
    userId: req.user._id,
    title,
    subject,
    currentPage: currentPage || 0,
    totalPages: totalPages || 100,
    lastOpened: lastOpened || 'Just added'
  });
  res.status(201).json({ success: true, data: { pdf } });
});

export const updatePdf = asyncHandler(async (req, res) => {
  const pdf = await StudyPdf.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!pdf) throw new ApiError(404, 'PDF not found');
  res.status(200).json({ success: true, data: { pdf } });
});

// --- RESOURCES ---
export const getResources = asyncHandler(async (req, res) => {
  const resources = await StudyResource.find({ userId: req.user._id }).sort({ favorite: -1, createdAt: -1 });
  res.status(200).json({ success: true, data: { resources } });
});

export const createResource = asyncHandler(async (req, res) => {
  const { title, url, subject, type, favorite } = req.body;
  if (!title || !url || !subject) throw new ApiError(400, 'Title, URL and subject are required');

  const resource = await StudyResource.create({
    userId: req.user._id,
    title,
    url,
    subject,
    type: type || 'Website',
    favorite: !!favorite
  });
  res.status(201).json({ success: true, data: { resource } });
});

export const updateResource = asyncHandler(async (req, res) => {
  const resource = await StudyResource.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!resource) throw new ApiError(404, 'Resource not found');
  res.status(200).json({ success: true, data: { resource } });
});

export const deleteResource = asyncHandler(async (req, res) => {
  const resource = await StudyResource.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!resource) throw new ApiError(404, 'Resource not found');
  res.status(200).json({ success: true, message: 'Resource deleted successfully' });
});

// --- COURSES ---
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await StudyCourse.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: { courses } });
});

export const createCourse = asyncHandler(async (req, res) => {
  const { title, subject, estimatedHours, modules, progress } = req.body;
  if (!title || !subject) throw new ApiError(400, 'Title and subject are required');

  const course = await StudyCourse.create({
    userId: req.user._id,
    title,
    subject,
    estimatedHours: estimatedHours || '',
    modules: modules || [],
    progress: progress || 0
  });
  res.status(201).json({ success: true, data: { course } });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await StudyCourse.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!course) throw new ApiError(404, 'Course not found');
  res.status(200).json({ success: true, data: { course } });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await StudyCourse.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!course) throw new ApiError(404, 'Course not found');
  res.status(200).json({ success: true, message: 'Course deleted successfully' });
});

// --- SPACED REVISIONS ---
export const getRevisions = asyncHandler(async (req, res) => {
  const revisions = await StudyRevision.find({ userId: req.user._id }).sort({ dueDate: 1 });
  res.status(200).json({ success: true, data: { revisions } });
});

export const createRevision = asyncHandler(async (req, res) => {
  const { topic, subject, interval, dueDate, status } = req.body;
  if (!topic || !subject || !dueDate) throw new ApiError(400, 'Topic, subject and dueDate are required');

  const revision = await StudyRevision.create({
    userId: req.user._id,
    topic,
    subject,
    interval: interval || 'Weekly',
    dueDate,
    status: status || 'upcoming'
  });
  res.status(201).json({ success: true, data: { revision } });
});

export const updateRevision = asyncHandler(async (req, res) => {
  const revision = await StudyRevision.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!revision) throw new ApiError(404, 'Revision not found');
  res.status(200).json({ success: true, data: { revision } });
});

export const deleteRevision = asyncHandler(async (req, res) => {
  const revision = await StudyRevision.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!revision) throw new ApiError(404, 'Revision not found');
  res.status(200).json({ success: true, message: 'Revision deleted successfully' });
});

// --- STUDY SESSIONS ---
export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await StudySession.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: { sessions } });
});

export const createSession = asyncHandler(async (req, res) => {
  const { subject, type, durationSeconds, durationText, date } = req.body;
  if (!subject || !durationSeconds || !date) throw new ApiError(400, 'Subject, durationSeconds, and date are required');

  const session = await StudySession.create({
    userId: req.user._id,
    subject,
    type: type || 'Practice',
    durationSeconds: parseInt(durationSeconds, 10),
    durationText: durationText || '0.0h',
    date
  });
  res.status(201).json({ success: true, data: { session } });
});

// @desc    Get study statistics summary
// @route   GET /api/v1/study/summary
// @access  Private
export const getStudySummary = asyncHandler(async (req, res) => {
  const sessions = await StudySession.find({ userId: req.user._id });
  const revisions = await StudyRevision.find({ userId: req.user._id, status: 'upcoming' });

  let totalMinutes = 0;
  let todayMinutes = 0;
  let weekMinutes = 0;
  let monthMinutes = 0;

  const now = new Date();
  const todayStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

  const getStartOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };
  const startOfWeek = getStartOfWeek(now);
  startOfWeek.setHours(0, 0, 0, 0);

  const subjectDistribution = {};
  const uniqueDates = new Set();

  sessions.forEach(sess => {
    const mins = Math.round(sess.durationSeconds / 60);
    totalMinutes += mins;

    subjectDistribution[sess.subject] = (subjectDistribution[sess.subject] || 0) + mins;

    // Normalize date separators (dashes to slashes)
    const normalizedDateStr = sess.date.replace(/-/g, '/');

    const sessDate = new Date(normalizedDateStr);
    if (!isNaN(sessDate.getTime())) {
      uniqueDates.add(normalizedDateStr);

      if (normalizedDateStr === todayStr) {
        todayMinutes += mins;
      }

      sessDate.setHours(0, 0, 0, 0);
      if (sessDate >= startOfWeek && sessDate <= now) {
        weekMinutes += mins;
      }

      if (sessDate.getMonth() === now.getMonth() && sessDate.getFullYear() === now.getFullYear()) {
        monthMinutes += mins;
      }
    }
  });

  let streak = 0;
  if (uniqueDates.size > 0) {
    const parseDateStr = (d) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    
    const yesterdayStr = parseDateStr(yesterday);

    const hasToday = uniqueDates.has(todayStr);
    const hasYesterday = uniqueDates.has(yesterdayStr);

    if (hasToday || hasYesterday) {
      streak = 1;
      let checkDate = hasToday ? now : yesterday;
      
      while (true) {
        const prevDay = new Date(checkDate);
        prevDay.setDate(checkDate.getDate() - 1);
        const prevDayStr = parseDateStr(prevDay);

        if (uniqueDates.has(prevDayStr)) {
          streak++;
          checkDate = prevDay;
        } else {
          break;
        }
      }
    }
  }

  res.status(200).json({
    success: true,
    data: {
      totalMinutes,
      todayMinutes,
      weekMinutes,
      monthMinutes,
      sessionCount: sessions.length,
      streak,
      subjectDistribution,
      upcomingRevisionsCount: revisions.length
    }
  });
});
