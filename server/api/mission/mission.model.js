'use strict';

import mongoose from 'mongoose';

var MissionSchema = new mongoose.Schema({
  agent: String,
  country: String,
  address: String,
  date: Date,
  location: { type: [Number], index: '2dsphere'}
});

export default mongoose.model('Mission', MissionSchema);
