import mongoose from 'mongoose';
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, 'Password is required'], minlength: 6 },
    role: { type: String, enum: ['admin', 'quality_inspector', 'production_manager'], default: 'quality_inspector' },
}, { timestamps: true });

userSchema.index({ role: 1 });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    // Use Node native crypto to bypass Webpack minification bugs
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(this.password, salt, 64).toString('hex');
    this.password = `${salt}:${hash}`;
    
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password.includes(':')) {
        // Fallback for old bcrypt passwords if any exist (will fail on Vercel due to minification, but prevents crash)
        return false;
    }
    const [salt, storedHash] = this.password.split(':');
    const hashToVerify = crypto.scryptSync(enteredPassword, salt, 64).toString('hex');
    return hashToVerify === storedHash;
};

export default mongoose.models.User || mongoose.model('User', userSchema);
