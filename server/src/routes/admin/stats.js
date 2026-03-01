const express = require('express');
const { authMiddleware, requireRole } = require('../../middleware/auth');
const User = require('../../models/User');
const Project = require('../../models/Project');
const Message = require('../../models/Message');

const router = express.Router();

// Admin: Get dashboard overview
router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const employeeCount = await User.countDocuments({ role: 'employee' });
        const clientCount = await User.countDocuments({ role: 'client' });
        const projectCount = await Project.countDocuments();
        const messageCount = await Message.countDocuments();
        res.json({ userCount, employeeCount, clientCount, projectCount, messageCount });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
