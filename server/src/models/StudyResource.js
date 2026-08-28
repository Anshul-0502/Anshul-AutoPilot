import mongoose from 'mongoose';

const studyResourceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'Resource URL is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  type: {
    type: String,
    default: 'Website',
    trim: true
  },
  favorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

studyResourceSchema.index({ userId: 1, favorite: -1, createdAt: -1 });

studyResourceSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const StudyResource = mongoose.model('StudyResource', studyResourceSchema);

export default StudyResource;
