 import mongoose from 'mongoose';

const doctorProfileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // Ensures one profile per doctor user
    },
    specialization: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
        min: 0,
    },
    location: {
        type: String,
        required: true,
    },
    clinic: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    schedule: [{ // Array of schedule entries, can be more detailed
        day: { type: String, required: true }, // e.g., 'Monday', 'Tuesday'
        timeSlots: [{ type: String }] // e.g., ['09:00', '10:00']
    }],
    ratings: [{ // Array to store individual ratings
        type: Number,
        min: 1,
        max: 5,
    }],
    totalAppointments: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
});

const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);

export default DoctorProfile;
