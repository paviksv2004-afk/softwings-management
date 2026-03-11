const express = require('express');
const router = express.Router();

// ✅ FIXED: Changed 'Middleware' to 'middleware' (lowercase)
const authorizeRoles = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser
} = require('../controllers/usercontroller');

// =====================
// Public Route
// =====================
router.post('/login', loginUser);

// =====================
// Protected Routes
// =====================

// Register (Admin & Manager only)
router.post('/register', authMiddleware, authorizeRoles('admin', 'manager'), registerUser);

// View All Users (Admin, Manager, Staff)
router.get('/', authMiddleware, authorizeRoles('admin', 'manager', 'staff'), getAllUsers);

// View Single User (Admin, Manager, Staff)
router.get('/:id', authMiddleware, authorizeRoles('admin', 'manager', 'staff'), getUserById);

// Update User (Admin & Manager only)
router.put('/:id', authMiddleware, authorizeRoles('admin', 'manager'), updateUser);

// Delete User (Admin & Manager only)
router.delete('/:id', authMiddleware, authorizeRoles('admin', 'manager'), deleteUser);

module.exports = router;