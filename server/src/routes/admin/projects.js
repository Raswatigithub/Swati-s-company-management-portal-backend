const express = require('express');
const { authMiddleware, requireRole } = require('../../middleware/auth');
const Project = require('../../models/Project');

const router = express.Router();

// Admin ONLY: Full project management
router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const projects = await Project.find({}).populate('client assignedEmployees', 'name email company');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
