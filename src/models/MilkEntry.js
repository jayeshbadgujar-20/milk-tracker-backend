const mongoose = require('mongoose');

const milkEntrySchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  session: {
    type: String,
    enum: ['Morning', 'Evening'],
    required: [true, 'Session is required']
  },
  milkQuantity: {
    type: Number,
    required: [true, 'Milk quantity is required'],
    min: [0.01, 'Milk quantity must be greater than 0']
  },
  fat: {
    type: Number,
    required: false
  },
  ratePerLiter: {
    type: Number,
    required: [true, 'Rate per liter is required'],
    min: [0.01, 'Rate per liter must be greater than 0']
  },
  amount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate entries for same date and session
milkEntrySchema.index({ date: 1, session: 1 }, { unique: true });

const MilkEntry = mongoose.model('MilkEntry', milkEntrySchema);

module.exports = MilkEntry;
