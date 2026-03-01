const express = require('express');
const { authMiddleware, requireRole } = require('../../middleware/auth');
const ServiceRequest = require('../../models/ServiceRequest');
const Project = require('../../models/Project');

const router = express.Router();

// Admin ONLY: Review service requests
router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const requests = await ServiceRequest.find({}).populate('client service', 'name email company image');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const req_doc = await ServiceRequest.findByIdAndUpdate(id, { status }, { new: true }).populate('service client');

        if (status === 'approved') {
            const proj = new Project({
                name: `${req_doc.service?.name || 'New Project'} - ${req_doc.client?.name}`,
                description: req_doc.description,
                client: req_doc.client?._id,
                image: req_doc.service?.image,
                serviceRequest: id
            });
            await proj.save();
        }
        res.json(req_doc);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
