import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    default: ''
  },
  photo: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  college: {
    type: String,
    default: ''
  },
  skills: {
    type: String,
    default: ''
  },
  careerGoal: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
