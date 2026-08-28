import mongoose from 'mongoose';

const studyNoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  pinned: {
    type: Boolean,
    default: false
  },
  favorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

studyNoteSchema.index({ userId: 1, pinned: -1, updatedAt: -1 });

studyNoteSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    // Format date string for the frontend (which expects lastUpdated as a string)
    if (ret.updatedAt) {
      const d = new Date(ret.updatedAt);
      ret.lastUpdated = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }
    return ret;
  }
});

const StudyNote = mongoose.model('StudyNote', studyNoteSchema);

export default StudyNote;
