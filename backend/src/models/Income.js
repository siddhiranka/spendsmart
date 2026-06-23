const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    notes: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

incomeSchema.index({ user_id: 1, date: -1 });

incomeSchema.virtual('id').get(function() { return this._id.toHexString(); });
incomeSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } });

module.exports = mongoose.model('Income', incomeSchema);
