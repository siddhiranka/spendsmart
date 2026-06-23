const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

notificationSchema.index({ user_id: 1, is_read: 1 });

notificationSchema.virtual('id').get(function() { return this._id.toHexString(); });
notificationSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } });

module.exports = mongoose.model('Notification', notificationSchema);
