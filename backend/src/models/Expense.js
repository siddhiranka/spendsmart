const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    payment_method: { type: String },
    date: { type: Date, required: true },
    notes: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

expenseSchema.index({ user_id: 1, date: -1 });

expenseSchema.virtual('id').get(function() { return this._id.toHexString(); });
expenseSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } });

module.exports = mongoose.model('Expense', expenseSchema);
