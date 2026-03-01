const express = require('express');
const { authMiddleware, requireRole } = require('../../middleware/auth');
const Project = require('../../models/Project');

const router = express.Router();

// Employee: View assigned projects
router.get('/', authMiddleware, requireRole('employee'), async (req, res) => {
    try {
        const projects = await Project.find({ assignedEmployees: req.user.id }).populate('client assignedEmployees', 'name email company');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Employee: Update project status
router.put('/:id', authMiddleware, requireRole('employee'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const project = await Project.findOneAndUpdate({ _id: id, assignedEmployees: req.user.id }, { status }, { new: true });
        if (!project) return res.status(404).json({ message: 'Project not found or not assigned' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
