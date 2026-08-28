import mongoose from 'mongoose';

const projectTaskSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, default: 'Medium' },
  deadline: { type: String, default: '' },
  status: { type: String, default: 'todo' },
  subtasks: { type: Array, default: [] }
}, { _id: false });

const projectMilestoneSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true },
  title: { type: String, required: true },
  dueDate: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  progress: { type: Number, default: 0 }
}, { _id: false });

const projectDocSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, default: '' },
  content: { type: String, default: '' }
}, { _id: false });

const projectResourceSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true },
  name: { type: String, required: true },
  type: { type: String, default: '' },
  url: { type: String, default: '' }
}, { _id: false });

const projectBugSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  severity: { type: String, default: 'Minor' },
  module: { type: String, default: '' },
  status: { type: String, default: 'In Progress' },
  date: { type: String, default: '' }
}, { _id: false });

const projectDeploymentSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true },
  env: { type: String, default: '' },
  platform: { type: String, default: '' },
  url: { type: String, default: '' },
  version: { type: String, default: '' },
  date: { type: String, default: '' }
}, { _id: false });

const projectReleaseSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true },
  version: { type: String, required: true },
  date: { type: String, default: '' },
  releaseNotes: { type: String, default: '' }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'General'
  },
  techStack: {
    type: [String],
    default: []
  },
  startDate: {
    type: String,
    default: ''
  },
  deadline: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    default: 'Medium'
  },
  status: {
    type: String,
    default: 'In Progress'
  },
  version: {
    type: String,
    default: 'v1.0.0'
  },
  progress: {
    type: Number,
    default: 0
  },
  tasks: {
    type: [projectTaskSchema],
    default: []
  },
  milestones: {
    type: [projectMilestoneSchema],
    default: []
  },
  docs: {
    type: [projectDocSchema],
    default: []
  },
  resources: {
    type: [projectResourceSchema],
    default: []
  },
  bugs: {
    type: [projectBugSchema],
    default: []
  },
  deployments: {
    type: [projectDeploymentSchema],
    default: []
  },
  releases: {
    type: [projectReleaseSchema],
    default: []
  }
}, {
  timestamps: true
});

projectSchema.index({ userId: 1, createdAt: -1 });

projectSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
