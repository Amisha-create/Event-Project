const express = require('express');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const authenticate = require('../authMiddleware');
const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Create new event (organizer/admin)
router.post('/', authenticate, async (req, res) => {
  if (!['organizer', 'admin'].includes(req.user.role)) return res.status(403).json({error: 'Forbidden'});
  const { title, description, date, location } = req.body;
  const event = await Event.create({ title, description, date, location, organizer: req.user.id });
  res.json(event);
});

// Register for event (student)
router.post('/:id/register', authenticate, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({error: 'Only students can register'});
  const already = await Registration.findOne({ event: req.params.id, user: req.user.id });
  if (already) return res.status(400).json({ error: "Already registered." });
  await Registration.create({ event: req.params.id, user: req.user.id, status: 'pending' });
  await Event.findByIdAndUpdate(req.params.id, { $inc: { attendeeCount: 1 } });
  res.json({ message: "Registered. Awaiting approval." });
});

// See registrations for organizer's events
router.get('/registrations', authenticate, async (req, res) => {
  if (req.user.role !== 'organizer') return res.status(403).json({error: 'Forbidden'});
  const events = await Event.find({ organizer: req.user.id });
  const regs = await Registration.find({ event: { $in: events.map(e => e._id) } })
    .populate('user')
    .populate('event');
  res.json(regs);
});

// Approve/reject registration
router.post('/registrations/:regId', authenticate, async (req, res) => {
  if (req.user.role !== 'organizer') return res.status(403).json({error: 'Forbidden'});
  const { status } = req.body;
  const reg = await Registration.findByIdAndUpdate(req.params.regId, { status }, { new: true });
  if (!reg) return res.status(404).json({ error: "Not found." });
  res.json(reg);
});

module.exports = router;
