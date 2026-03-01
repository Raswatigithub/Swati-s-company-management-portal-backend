const express = require('express');
const { authMiddleware, requireRole } = require('../../middleware/auth');
const ServiceRequest = require('../../models/ServiceRequest');

const router = express.Router();

// Client: Submit/View own service requests
router.post('/', authMiddleware, requireRole('client'), async (req, res) => {
    try {
        const { service, description } = req.body;
        const request = new ServiceRequest({ client: req.user.id, service, description });
        await request.save();
        res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', authMiddleware, requireRole('client'), async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ client: req.user.id }).populate('service', 'name image');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
