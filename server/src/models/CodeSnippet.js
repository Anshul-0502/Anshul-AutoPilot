import mongoose from 'mongoose';

const codeSnippetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Snippet title is required'],
    trim: true
  },
  lang: {
    type: String,
    required: [true, 'Language is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Snippet code content is required']
  },
  tags: {
    type: [String],
    default: []
  },
  favorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

codeSnippetSchema.index({ userId: 1, favorite: -1, createdAt: -1 });

codeSnippetSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema);

export default CodeSnippet;
