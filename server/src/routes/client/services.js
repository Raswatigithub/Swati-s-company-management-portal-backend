const express = require('express');
const { authMiddleware } = require('../../middleware/auth');
const Service = require('../../models/Service');

const router = express.Router();

// Clients: View available services
router.get('/', authMiddleware, async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
