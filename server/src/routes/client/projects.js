const express = require('express');
const { authMiddleware, requireRole } = require('../../middleware/auth');
const Project = require('../../models/Project');

const router = express.Router();

// Client: View own projects
router.get('/', authMiddleware, requireRole('client'), async (req, res) => {
    try {
        const projects = await Project.find({ client: req.user.id }).populate('assignedEmployees', 'name email');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
