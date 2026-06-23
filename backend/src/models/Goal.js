const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goal_name: { type: String, required: true },
    target_amount: { type: Number, required: true },
    saved_amount: { type: Number, default: 0.00 },
    target_date: { type: Date, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

goalSchema.virtual('id').get(function() { return this._id.toHexString(); });
goalSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } });

module.exports = mongoose.model('Goal', goalSchema);
