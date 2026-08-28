import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: [true, 'Goal title is required'], 
    trim: true 
  },
  description: { 
    type: String, 
    default: '' 
  },
  category: {
    type: String,
    enum: ['coding', 'dsa', 'study', 'task', 'project', 'health', 'skill', 'custom'],
    default: 'custom'
  },
  metric: {
    type: String,
    enum: [
      'dsa_problems_solved',
      'coding_minutes',
      'study_minutes',
      'tasks_completed',
      'projects_completed',
      'workouts_completed',
      'meditation_minutes',
      'water_goal_days',
      'focus_minutes',
      'xp_earned',
      'custom'
    ],
    default: 'custom'
  },
  targetValue: { 
    type: Number, 
    required: [true, 'Target value is required'], 
    min: [1, 'Target value must be at least 1'], 
    default: 1 
  },
  manualCurrentValue: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  unit: { 
    type: String, 
    default: '' 
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom', 'lifetime'],
    default: 'daily'
  },
  startDate: { 
    type: Date, 
    required: [true, 'Start date is required'] 
  },
  endDate: { 
    type: Date, 
    required: [true, 'End date is required'] 
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled', 'archived'],
    default: 'active'
  },
  sourceFilter: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

goalSchema.index({ userId: 1, status: 1, period: 1 });

goalSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
