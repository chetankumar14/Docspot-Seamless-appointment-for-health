import User from '../models/User.js';
import DoctorProfile from '../models/DoctorProfile.js';

// @desc    Get all approved doctors (for customer dashboard)
// @route   GET /api/doctors/
// @access  Public
const getApprovedDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor', isApproved: true }).select('-password');
        
        // Populate full doctor profile for each approved doctor
        const doctorsWithProfiles = await Promise.all(
            doctors.map(async (doctor) => {
                const profile = await DoctorProfile.findOne({ userId: doctor._id });
                return {
                    ...doctor._doc, // Get plain JavaScript object from Mongoose document
                    profile: profile || {} // Attach profile; use empty object if not found (shouldn't happen for approved doctors)
                };
            })
        );
        res.json(doctorsWithProfiles);
    } catch (error) {
        console.error('Error in getApprovedDoctors:', error.message);
        res.status(500).json({ message: 'Server error fetching approved doctors.', error: error.message });
    }
};

// @desc    Get logged-in doctor's own profile
// @route   GET /api/doctors/profile
// @access  Private/Doctor
const getDoctorProfile = async (req, res) => {
    try {
        const doctorProfile = await DoctorProfile.findOne({ userId: req.user._id });

        if (!doctorProfile) {
            console.log(`Doctor profile not found for logged-in user ID: ${req.user._id}`);
            return res.status(404).json({ message: 'Doctor profile not found for this user. Please click "Update Profile" to create and fill out your profile.' });
        }
        res.json(doctorProfile);
    } catch (error) {
        console.error('Error fetching doctor profile:', error.message);
        res.status(500).json({ message: 'Server error fetching doctor profile.', error: error.message });
    }
};

// @desc    Update logged-in doctor's profile details
// @route   PUT /api/doctors/profile
// @access  Private/Doctor
const updateDoctorProfile = async (req, res) => {
    const { specialization, experience, location, clinic, phoneNumber, bio, schedule } = req.body;
    const userId = req.user._id; // User ID from authenticated request

    try {
        const doctorProfile = await DoctorProfile.findOne({ userId });

        if (!doctorProfile) {
            console.log(`Attempt to update doctor profile failed: profile not found for user ID: ${userId}`);
            return res.status(404).json({ message: 'Doctor profile not found for updating. Please ensure your profile exists.' });
        }

        // Update fields if they are provided. Use '!== undefined' for explicit check.
        doctorProfile.specialization = specialization !== undefined ? specialization : doctorProfile.specialization;
        doctorProfile.experience = experience !== undefined ? experience : doctorProfile.experience;
        doctorProfile.location = location !== undefined ? location : doctorProfile.location;
        doctorProfile.clinic = clinic !== undefined ? clinic : doctorProfile.clinic;
        doctorProfile.phoneNumber = phoneNumber !== undefined ? phoneNumber : doctorProfile.phoneNumber;
        doctorProfile.bio = bio !== undefined ? bio : doctorProfile.bio;
        
        if (schedule !== undefined) {
            doctorProfile.schedule = schedule;
        }

        const updatedProfile = await doctorProfile.save();
        console.log(`Doctor profile updated successfully for User ID: ${userId}`);
        res.json(updatedProfile);
    } catch (error) {
        console.error('Error updating doctor profile:', error.message);
        res.status(500).json({ message: 'Server error updating doctor profile.', error: error.message });
    }
};

// @desc    Get all pending doctor applications (for admin dashboard)
// @route   GET /api/doctors/pending
// @access  Private/Admin
const getPendingDoctors = async (req, res) => {
    try {
        const pendingDoctors = await User.find({ role: 'doctor', isApproved: false }).select('-password');
        res.json(pendingDoctors);
    } catch (error) {
        console.error('Error in getPendingDoctors:', error.message);
        res.status(500).json({ message: 'Server error fetching pending doctors.', error: error.message });
    }
};

// @desc    Approve a doctor's account (by admin)
// @route   PUT /api/doctors/approve/:id
// @access  Private/Admin
const approveDoctor = async (req, res) => {
    try {
        const doctor = await User.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (doctor.role !== 'doctor') {
            return res.status(400).json({ message: 'User is not a doctor' });
        }
        
        doctor.isApproved = true;
        await doctor.save();
        console.log(`Doctor account ${doctor.email} (ID: ${doctor._id}) approved by admin.`);
        res.json({ message: 'Doctor approved successfully' });
    } catch (error) {
        console.error('Error approving doctor:', error.message);
        res.status(500).json({ message: 'Server error approving doctor.', error: error.message });
    }
};

export { getApprovedDoctors, getDoctorProfile, updateDoctorProfile, getPendingDoctors, approveDoctor };
