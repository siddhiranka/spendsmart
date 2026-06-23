const mongoose = require('mongoose');

const emiSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loan_name: { type: String, required: true },
    principal: { type: Number, required: true },
    interest: { type: Number, required: true },
    tenure: { type: Number, required: true },
    start_date: { type: Date, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

emiSchema.virtual('id').get(function() { return this._id.toHexString(); });
emiSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } });

module.exports = mongoose.model('Emi', emiSchema);
