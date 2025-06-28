import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: { // Added username field
        type: String,
        required: true,
        unique: true, // Ensure username is unique
        lowercase: true, // Store usernames in lowercase for consistency
        trim: true // Remove whitespace from both ends
    },
    email: {
        type: String,
        required: true,
        unique: true, // Enforces unique email addresses
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['customer', 'doctor', 'admin'],
        default: 'customer',
    },
    isApproved: {
        type: Boolean,
        default: false, // For doctors, requires admin approval
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Middleware to hash the password before saving a new user or when password is modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error('Error hashing password:', error);
        next(error); // Pass error to Express error handling middleware
    }
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    // Return true if passwords match, false otherwise
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
