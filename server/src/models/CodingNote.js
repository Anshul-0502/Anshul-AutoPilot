import mongoose from 'mongoose';

const codingNoteSchema = new mongoose.Schema({
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
  content: {
    type: String,
    default: ''
  },
  lang: {
    type: String,
    default: 'General',
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  codeSnippet: {
    type: String,
    default: ''
  },
  favorite: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

codingNoteSchema.index({ userId: 1, createdAt: -1 });

codingNoteSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const CodingNote = mongoose.model('CodingNote', codingNoteSchema);

export default CodingNote;
