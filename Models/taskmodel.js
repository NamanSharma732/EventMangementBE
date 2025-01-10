const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
    required: true, 
  },
  assignedAttendee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendee',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', 
    required: true,
  },
  progressPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0, 
  },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

