import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    appointmentDate: {
        type: Date,
        required: true,
    },
    documents: [{ // Array of document URLs (strings for file names/paths)
        type: String,
    }],
    status: {
        type: String,
        enum: ['pending', 'scheduled', 'canceled', 'completed', 'rescheduled'],
        default: 'pending',
    },
    isEmergency: {
        type: Boolean,
        default: false,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending', // Default to pending, can be set to 'paid' on booking confirm
    },
}, {
    timestamps: true,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
