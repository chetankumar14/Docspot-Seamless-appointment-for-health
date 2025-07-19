import Appointment from '../models/Appointment.js';
import DoctorProfile from '../models/DoctorProfile.js';
import User from '../models/User.js'; // Import User model to check doctor approval status

// @desc    Book a new appointment
// @route   POST /api/appointments/book
// @access  Private/Customer
const bookAppointment = async (req, res) => {
    const { doctorId, appointmentDate, documents } = req.body;
    const customerId = req.user._id; // Customer ID from authenticated request

    console.log(`Booking request for doctor ${doctorId} on ${appointmentDate} by customer ${customerId}`);

    try {
        // First, check if the target doctor (User) exists and is approved
        const targetDoctorUser = await User.findById(doctorId);
        if (!targetDoctorUser || targetDoctorUser.role !== 'doctor' || !targetDoctorUser.isApproved) {
            console.log(`Booking failed: Doctor ${doctorId} not found, not a doctor, or not approved.`);
            return res.status(400).json({ message: 'The selected doctor is not available for appointments or is not yet approved.' });
        }

        // Now find the DoctorProfile to update totalAppointments
        const doctorProfile = await DoctorProfile.findOne({ userId: doctorId });
        if (!doctorProfile) {
            console.log(`Booking failed: DoctorProfile not found for doctor ID: ${doctorId}.`);
            // This should ideally not happen if DoctorProfile is created on registration and approval
            return res.status(404).json({ message: 'Doctor profile data missing, cannot book appointment.' });
        }

        // Create the new appointment
        const appointment = await Appointment.create({
            customerId,
            doctorId,
            appointmentDate,
            documents,
            status: 'pending', // Initial status
            paymentStatus: 'paid', // As requested: simulate payment as already paid upon submission
        });

        // Increment total appointments for the doctor
        doctorProfile.totalAppointments = (doctorProfile.totalAppointments || 0) + 1;
        await doctorProfile.save();
        console.log(`Appointment booked and doctor's totalAppointments incremented for ${doctorId}.`);

        res.status(201).json({
            message: 'Appointment booked successfully. Payment confirmed.',
            appointment,
        });
    } catch (error) {
        console.error('Error booking appointment:', error.message);
        res.status(500).json({ message: `Server error booking appointment: ${error.message}` });
    }
};

// @desc    Get all appointments for a user (customer, doctor, or admin)
// @route   GET /api/appointments/my-appointments
// @access  Private
const getMyAppointments = async (req, res) => {
    const userId = req.user._id;
    const role = req.user.role;
    let appointments;

    try {
        if (role === 'customer') {
            appointments = await Appointment.find({ customerId: userId })
                .populate('doctorId', 'name email'); // Populate doctor's basic info
        } else if (role === 'doctor') {
            appointments = await Appointment.find({ doctorId: userId })
                .populate('customerId', 'name email'); // Populate customer's basic info
        } else if (role === 'admin') {
            // Admin can see all appointments
            appointments = await Appointment.find({})
                .populate('customerId', 'name email')
                .populate('doctorId', 'name email');
        } else {
            return res.status(403).json({ message: 'Not authorized to view appointments.' });
        }
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching my appointments:', error.message);
        res.status(500).json({ message: `Server error fetching appointments: ${error.message}` });
    }
};

// @desc    Update appointment status (by doctor or customer)
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res) => {
    const { status, isEmergency } = req.body;
    const appointmentId = req.params.id;
    const userId = req.user._id; // User making the request
    const role = req.user.role;

    console.log(`Attempting to update appointment ${appointmentId} to status: ${status} by user ${userId} (${role})`);

    try {
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            console.log(`Appointment ${appointmentId} not found.`);
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        // Authorization logic:
        const isDoctorManagingOwnAppointment = (role === 'doctor' && appointment.doctorId.toString() === userId.toString());
        const isCustomerCancelingOwnAppointment = (role === 'customer' && appointment.customerId.toString() === userId.toString() && status === 'canceled');
        const isAdminManaging = (role === 'admin');

        if (!isDoctorManagingOwnAppointment && !isCustomerCancelingOwnAppointment && !isAdminManaging) {
            console.log(`Unauthorized attempt to update appointment ${appointmentId} by user ${userId} (${role}).`);
            return res.status(403).json({ message: 'You are not authorized to update this appointment status.' });
        }

        // Specific status validation based on role
        if (role === 'customer' && status !== 'canceled') {
            return res.status(400).json({ message: 'Customers can only cancel their appointments.' });
        }
        if (role === 'doctor' && !['scheduled', 'completed', 'rescheduled', 'canceled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status update for a doctor.' });
        }

        // Update status
        appointment.status = status;
        
        // Only doctors (or admin) can set emergency status
        if ((role === 'doctor' || role === 'admin') && typeof isEmergency === 'boolean') {
            appointment.isEmergency = isEmergency;
        }

        const updatedAppointment = await appointment.save();
        console.log(`Appointment ${appointmentId} status updated to ${updatedAppointment.status}.`);
        res.json(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment status:', error.message);
        res.status(500).json({ message: `Server error updating appointment status: ${error.message}` });
    }
};

export { bookAppointment, getMyAppointments, updateAppointmentStatus };
