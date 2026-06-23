const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    income: { type: Number, required: true },
    savings_target: { type: Number, required: true },
    needs_limit: { type: Number, required: true },
    wants_limit: { type: Number, required: true },
    savings_limit: { type: Number, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

budgetSchema.index({ user_id: 1, month: 1, year: 1 }, { unique: true });

budgetSchema.virtual('id').get(function() { return this._id.toHexString(); });
budgetSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } });

module.exports = mongoose.model('Budget', budgetSchema);
