import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Subtask title is required'],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

// Configure subtask serialization
subtaskSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  category: {
    type: String,
    default: 'Others',
    trim: true
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low', 'Critical', 'High', 'Medium', 'Low'],
    default: 'medium'
  },
  deadline: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done', 'archived'],
    default: 'todo'
  },
  subtasks: {
    type: [subtaskSchema],
    default: []
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Enforce compound index for querying tasks by user
taskSchema.index({ userId: 1, createdAt: -1 });

// Automatically transform database _id fields to id for client components
taskSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    if (ret.subtasks && Array.isArray(ret.subtasks)) {
      ret.subtasks.forEach(sub => {
        sub.id = sub._id ? sub._id.toString() : '';
      });
    }
    return ret;
  }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
