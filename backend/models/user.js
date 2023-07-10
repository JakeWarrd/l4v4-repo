const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  blocs: [ // = SCHEDULES
    {
      blocName: String,
      taskSets: [
        {
          setName: String,
          tasks: [
            {
              taskName: String,
              checked: { type: Boolean },
            },
          ],
          startTime: Number, // Updated data type
          endTime: Number, // Updated data type
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define a method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Add a pre-save hook to enforce the maximum number of blocs
userSchema.pre('save', function (next) {
  if (this.blocs.length > 2) {
    const err = new Error('Maximum number of blocs exceeded');
    next(err);
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;