import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import DoctorProfile from '../models/DoctorProfile.js';
import bcrypt from 'bcryptjs';

// Helper function to generate a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, username, email, password } = req.body;

    console.log('Incoming registration request body:', req.body);

    try {
        if (!name || !username || !email || !password) {
            console.log('Registration failed: Missing required fields.');
            return res.status(400).json({ message: 'Please enter all fields: name, username, email, and password.' });
        }

        const userExistsByEmail = await User.findOne({ email });
        if (userExistsByEmail) {
            console.log(`Registration failed: User with email ${email} already exists.`);
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const userExistsByUsername = await User.findOne({ username: username.toLowerCase() });
        if (userExistsByUsername) {
            console.log(`Registration failed: User with username ${username} already exists.`);
            return res.status(400).json({ message: 'User with this username already exists.' });
        }

        let role = 'customer';
        let isApproved = true;
        if (email.endsWith('@doctor.com')) {
            role = 'doctor';
            isApproved = false;
        }

        const user = await User.create({
            name,
            username: username.toLowerCase(),
            email,
            password, // Hashing handled by pre-save hook in User model
            role,
            isApproved,
        });

        if (user) {
            console.log(`User registered successfully: ${user.email}, Username: ${user.username}, Role: ${user.role}, Approved: ${user.isApproved}`);

            // If the user is a doctor, create an associated DoctorProfile
            if (user.role === 'doctor') {
                try {
                    await DoctorProfile.create({
                        userId: user._id,
                        specialization: 'General Practice',
                        experience: 1,
                        location: 'Not Specified',
                        clinic: 'Not Specified',
                        phoneNumber: 'Not Specified',
                        bio: 'Doctor profile pending update.',
                        schedule: []
                    });
                    console.log(`Doctor profile successfully created for User ID: ${user._id}`);
                } catch (profileError) {
                    console.error(`ERROR creating DoctorProfile for new user ${user._id}:`, profileError.message);
                }
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                token: generateToken(user._id),
                message: email.endsWith('@doctor.com') ? 'Registration successful! Your doctor account is pending admin approval.' : 'Registration successful! You can now log in.'
            });
        } else {
            console.log('Registration failed: Invalid user data provided.');
            res.status(400).json({ message: 'Invalid user data provided for registration.' });
        }
    } catch (error) {
        console.error('SERVER ERROR during user registration (outer catch):', error);
        res.status(500).json({ message: `Server error during registration: ${error.message}` });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log(`Login attempt for email: ${email}`);

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (user.role === 'doctor' && !user.isApproved) {
                console.log(`Login failed: Doctor account ${email} is pending admin approval.`);
                return res.status(403).json({ message: 'Your doctor account is pending admin approval. Please wait for an admin to approve your account.' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                token: generateToken(user._id),
            });
        } else {
            console.log(`Login failed for email: ${email}. Invalid credentials.`);
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('SERVER ERROR during user login (outer catch):', error);
        res.status(500).json({ message: `Server error during login: ${error.message}` });
    }
};

export { registerUser, loginUser };
