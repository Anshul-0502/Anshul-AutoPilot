import mongoose from 'mongoose';

const studyPdfSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'PDF title is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  currentPage: {
    type: Number,
    default: 0
  },
  totalPages: {
    type: Number,
    default: 100
  },
  lastOpened: {
    type: String,
    default: 'Just added'
  }
}, {
  timestamps: true
});

studyPdfSchema.index({ userId: 1, updatedAt: -1 });

studyPdfSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const StudyPdf = mongoose.model('StudyPdf', studyPdfSchema);

export default StudyPdf;
