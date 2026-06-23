const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    investment_name: { type: String, required: true },
    investment_type: { type: String, required: true },
    amount: { type: Number, required: true },
    purchase_date: { type: Date, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

investmentSchema.virtual('id').get(function() { return this._id.toHexString(); });
investmentSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } });

module.exports = mongoose.model('Investment', investmentSchema);
