const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  tenure: { type: Number, required: true },
  income: { type: Number, required: true },
  status: { type: String, default: 'Pending AI Review' }, // Default status when submitted
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Loan', loanSchema);