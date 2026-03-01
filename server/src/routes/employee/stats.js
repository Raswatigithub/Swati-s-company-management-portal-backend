const express = require('express');
const { authMiddleware, requireRole } = require('../../middleware/auth');
const Project = require('../../models/Project');
const Message = require('../../models/Message');

const router = express.Router();

router.get('/', authMiddleware, requireRole('employee'), async (req, res) => {
    try {
        const userId = req.user.id;
        const assignedProjects = await Project.countDocuments({ assignedEmployees: userId });
        const messageCount = await Message.countDocuments({ to: userId });
        res.json({ assignedProjects, messageCount });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
