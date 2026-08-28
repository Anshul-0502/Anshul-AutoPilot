import { Router } from 'express';
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

export default router;
