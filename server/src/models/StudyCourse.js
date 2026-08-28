import mongoose from 'mongoose';

const courseModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

courseModuleSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const studyCourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  estimatedHours: {
    type: String,
    default: ''
  },
  modules: {
    type: [courseModuleSchema],
    default: []
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

studyCourseSchema.index({ userId: 1, createdAt: -1 });

studyCourseSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    if (ret.modules && Array.isArray(ret.modules)) {
      ret.modules.forEach(m => {
        m.id = m._id ? m._id.toString() : '';
      });
    }
    return ret;
  }
});

const StudyCourse = mongoose.model('StudyCourse', studyCourseSchema);

export default StudyCourse;
