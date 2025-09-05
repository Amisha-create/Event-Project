const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendeeCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Event', EventSchema);

