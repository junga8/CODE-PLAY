const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food & Dining',
      'Transportation',
      'Housing',
      'Utilities',
      'Insurance',
      'Healthcare',
      'Entertainment',
      'Shopping',
      'Education',
      'Other'
    ]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema); 