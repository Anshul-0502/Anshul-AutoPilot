import { Router } from 'express';
import {
  getLanguages, createLanguage, updateLanguage, deleteLanguage,
  getProblems, createProblem, updateProblem, deleteProblem,
  getSnippets, createSnippet, updateSnippet, deleteSnippet,
  getNotes, createNote, updateNote, deleteNote,
  getGoals, createGoal, updateGoal, deleteGoal,
  getResources, createResource, deleteResource,
  getInterviewTopics, createInterviewTopic, updateInterviewTopic, deleteInterviewTopic,
  getSessions, createSession,
  getCodingSummary
} from '../controllers/codingController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

// Coding summary stats
router.get('/summary', getCodingSummary);

// Languages
router.route('/languages')
  .get(getLanguages)
  .post(createLanguage);
router.route('/languages/:id')
  .put(updateLanguage)
  .delete(deleteLanguage);

// Problems
router.route('/problems')
  .get(getProblems)
  .post(createProblem);
router.route('/problems/:id')
  .put(updateProblem)
  .delete(deleteProblem);

// Snippets
router.route('/snippets')
  .get(getSnippets)
  .post(createSnippet);
router.route('/snippets/:id')
  .put(updateSnippet)
  .delete(deleteSnippet);

// Notes
router.route('/notes')
  .get(getNotes)
  .post(createNote);
router.route('/notes/:id')
  .put(updateNote)
  .delete(deleteNote);

// Goals
router.route('/goals')
  .get(getGoals)
  .post(createGoal);
router.route('/goals/:id')
  .put(updateGoal)
  .delete(deleteGoal);

// Resources
router.route('/resources')
  .get(getResources)
  .post(createResource);
router.route('/resources/:id')
  .delete(deleteResource);

// Interview Topics
router.route('/interview')
  .get(getInterviewTopics)
  .post(createInterviewTopic);
router.route('/interview/:id')
  .put(updateInterviewTopic)
  .delete(deleteInterviewTopic);

// Sessions
router.route('/sessions')
  .get(getSessions)
  .post(createSession);

export default router;
