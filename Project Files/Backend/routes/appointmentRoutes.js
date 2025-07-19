import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { bookAppointment, getMyAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';

const router = express.Router();

// Private/Customer route to book an appointment
router.post('/book', protect, bookAppointment);

// Private route to get appointments for the logged-in user
router.get('/my-appointments', protect, getMyAppointments);

// Private route to update appointment status (accessible to doctor/customer)
router.put('/:id/status', protect, updateAppointmentStatus);

export default router;