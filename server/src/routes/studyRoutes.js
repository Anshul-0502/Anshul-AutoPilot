import { Router } from 'express';
import {
  getSubjects, createSubject, updateSubject, deleteSubject,
  getNotes, createNote, updateNote, deleteNote,
  getPdfs, createPdf, updatePdf,
  getResources, createResource, updateResource, deleteResource,
  getCourses, createCourse, updateCourse, deleteCourse,
  getRevisions, createRevision, updateRevision, deleteRevision,
  getSessions, createSession,
  getStudySummary
} from '../controllers/studyController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

// Secure all study endpoints
router.use(authenticate);

// Summary Metrics
router.get('/summary', getStudySummary);

// Subjects
router.route('/subjects')
  .get(getSubjects)
  .post(createSubject);
router.route('/subjects/:id')
  .put(updateSubject)
  .delete(deleteSubject);

// Notes
router.route('/notes')
  .get(getNotes)
  .post(createNote);
router.route('/notes/:id')
  .put(updateNote)
  .delete(deleteNote);

// PDFs
router.route('/pdfs')
  .get(getPdfs)
  .post(createPdf);
router.route('/pdfs/:id')
  .put(updatePdf);

// Resources
router.route('/resources')
  .get(getResources)
  .post(createResource);
router.route('/resources/:id')
  .put(updateResource)
  .delete(deleteResource);

// Courses
router.route('/courses')
  .get(getCourses)
  .post(createCourse);
router.route('/courses/:id')
  .put(updateCourse)
  .delete(deleteCourse);

// Revisions
router.route('/revisions')
  .get(getRevisions)
  .post(createRevision);
router.route('/revisions/:id')
  .put(updateRevision)
  .delete(deleteRevision);

// Sessions
router.route('/sessions')
  .get(getSessions)
  .post(createSession);

export default router;
