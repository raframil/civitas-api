const mongoose = require('../database');

const ReportSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  location: {
    address: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true }
  },
  photo: {
    type: String,
    required: true
  },
  reportType: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
