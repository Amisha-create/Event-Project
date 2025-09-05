const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/eventdb')
  .then(() => console.log('MongoDB connected'))
  .catch(e => console.log(e));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.listen(4000, () => console.log('Backend running on http://localhost:4000/'));
