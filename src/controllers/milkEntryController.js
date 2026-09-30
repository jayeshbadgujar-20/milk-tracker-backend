const MilkEntry = require('../models/MilkEntry');

// @desc    Create new milk entry
// @route   POST /api/milk-entries
// @access  Public
const createMilkEntry = async (req, res) => {
  try {
    const { date, session, milkQuantity, fat, ratePerLiter } = req.body;

    // Calculate amount
    const amount = milkQuantity * ratePerLiter;

    const milkEntry = await MilkEntry.create({
      date,
      session,
      milkQuantity,
      fat,
      ratePerLiter,
      amount
    });

    res.status(201).json({
      success: true,
      message: 'Milk entry created successfully',
      data: milkEntry
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A ' + req.body.session + ' entry already exists for this date.'
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all milk entries with optional date filter
// @route   GET /api/milk-entries
// @access  Public
const getMilkEntries = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let query = {};

    if (date) {
      query.date = date;
    } else if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const entries = await MilkEntry.find(query).sort({ date: 1, createdAt: 1 });

    // Calculate summary for returned entries
    const summary = entries.reduce((acc, entry) => {
      acc.totalQuantity += entry.milkQuantity;
      acc.totalAmount += entry.amount;
      return acc;
    }, { totalQuantity: 0, totalAmount: 0 });

    res.status(200).json({
      success: true,
      data: entries,
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  createMilkEntry,
  getMilkEntries
};
