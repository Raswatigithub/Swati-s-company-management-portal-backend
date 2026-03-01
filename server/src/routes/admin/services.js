const express = require('express');
const { authMiddleware, requireRole } = require('../../middleware/auth');
const Service = require('../../models/Service');

const router = express.Router();

// Admin ONLY: Manage services
router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const service = new Service({ name, description, image });
        await service.save();
        res.status(201).json(service);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
