import mongoose from 'mongoose';

const codingResourceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Resource name is required'],
    trim: true
  },
  type: {
    type: String,
    default: 'Documentation',
    trim: true
  },
  url: {
    type: String,
    required: [true, 'Resource URL is required'],
    trim: true
  },
  lang: {
    type: String,
    default: 'General',
    trim: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

codingResourceSchema.index({ userId: 1, name: 1 });

codingResourceSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const CodingResource = mongoose.model('CodingResource', codingResourceSchema);

export default CodingResource;
