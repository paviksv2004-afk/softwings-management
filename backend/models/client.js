const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['hosting', 'domain', 'ssl', 'amc'] },
  start: { type: String, required: true },
  duration: { type: Number, required: true },
  durationType: { type: String, enum: ['year', 'month'], required: true },
  amount: { type: Number, required: true },
  endDate: { type: String, required: true }
});

const clientSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  contactPerson: { type: String },
  mobile: { type: String },
  address: { type: String },
  services: [serviceSchema],
  totalAmount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Check if model already exists before creating
const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

module.exports = Client;