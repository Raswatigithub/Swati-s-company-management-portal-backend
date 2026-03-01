const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

// Get all services (Public)
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({}).sort({ name: 1 });
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
