import mongoose from 'mongoose';

const alertRegisterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['water', 'study', 'habit', 'eye', 'other'],
    default: 'other'
  }
}, {
  timestamps: true
});

alertRegisterSchema.index({ userId: 1 });

alertRegisterSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : '';
    return ret;
  }
});

const AlertRegister = mongoose.model('AlertRegister', alertRegisterSchema);

export default AlertRegister;
