const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique:true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendee',
    },
  ],

}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
