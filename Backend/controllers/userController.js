import User from '../models/User.js';

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = (req, res) => {
    // req.user is populated by the 'protect' middleware
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            isApproved: req.user.isApproved,
        });
    } else {
        res.status(404).json({ message: 'User profile not found.' });
    }
};

export { getUserProfile };
