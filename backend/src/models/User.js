const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    income: { type: Number, default: 0.00 },
    savings_goal: { type: Number, default: 0.00 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Ensure virtual 'id' exists to match SQLite payload
userSchema.virtual('id').get(function() { return this._id.toHexString(); });
userSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } });

module.exports = mongoose.model('User', userSchema);
