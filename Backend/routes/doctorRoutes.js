import express from 'express';
import { protect, admin, doctor } from '../middleware/authMiddleware.js';
import { 
    getApprovedDoctors, 
    getDoctorProfile, 
    updateDoctorProfile, 
    getPendingDoctors, 
    approveDoctor 
} from '../controllers/doctorController.js';

const router = express.Router();

// Public route to get all approved doctors (accessible to all, including unauthenticated users, for display)
router.get('/', getApprovedDoctors);

// Private/Doctor route to get the logged-in doctor's own profile
router.get('/profile', protect, doctor, getDoctorProfile);

// Private/Doctor route to update the logged-in doctor's own profile
router.put('/profile', protect, doctor, updateDoctorProfile);

// Private/Admin route to get pending doctor applications
router.get('/pending', protect, admin, getPendingDoctors);

// Private/Admin route to approve a doctor's account
router.put('/approve/:id', protect, admin, approveDoctor);

export default router;
