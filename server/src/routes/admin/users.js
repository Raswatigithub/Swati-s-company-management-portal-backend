const express = require('express');
const { authMiddleware, requireRole } = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Admin ONLY: Get all users
router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin ONLY: Create new user
router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const { name, email, password, role, company } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashed, role, company });
        await user.save();
        res.status(201).json({ message: 'User created', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin ONLY: Remove user
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ message: 'User removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
