const express = require('express');
const router = express.Router();

const authorizeRoles = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    deleteUser
} = require('../controllers/usercontroller');


// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
// Protected Routes
router.get(
  '/',
  authMiddleware,
  authorizeRoles('admin', 'manager', 'staff'),
  getAllUsers
);

router.get(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'manager', 'staff'),
  getUserById
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('admin', 'manager', 'staff'),
  deleteUser
);

module.exports = router;
