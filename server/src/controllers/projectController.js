import Project from '../models/Project.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all user projects
// @route   GET /api/v1/projects
// @access  Private
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: { projects } });
});

// @desc    Get a single project
// @route   GET /api/v1/projects/:id
// @access  Private
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
  if (!project) throw new ApiError(404, 'Project not found');
  res.status(200).json({ success: true, data: { project } });
});

// @desc    Create a new project
// @route   POST /api/v1/projects
// @access  Private
export const createProject = asyncHandler(async (req, res) => {
  const { name, description, category, techStack, startDate, deadline, priority, status, version, progress } = req.body;
  if (!name) throw new ApiError(400, 'Project name is required');

  const project = await Project.create({
    userId: req.user._id,
    name,
    description: description || '',
    category: category || 'General',
    techStack: techStack || [],
    startDate: startDate || '',
    deadline: deadline || '',
    priority: priority || 'Medium',
    status: status || 'In Progress',
    version: version || 'v1.0.0',
    progress: progress || 0,
    tasks: req.body.tasks || [],
    milestones: req.body.milestones || [],
    docs: req.body.docs || [],
    resources: req.body.resources || [],
    bugs: req.body.bugs || [],
    deployments: req.body.deployments || [],
    releases: req.body.releases || []
  });

  res.status(201).json({ success: true, data: { project } });
});

// @desc    Update a project
// @route   PUT /api/v1/projects/:id
// @access  Private
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!project) throw new ApiError(404, 'Project not found');
  res.status(200).json({ success: true, data: { project } });
});

// @desc    Delete a project
// @route   DELETE /api/v1/projects/:id
// @access  Private
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!project) throw new ApiError(404, 'Project not found');
  res.status(200).json({ success: true, message: 'Project deleted successfully' });
});
