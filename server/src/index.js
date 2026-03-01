
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Allow requests without an Origin header (curl, health checks, server-to-server).
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS blocked for this origin'));
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Common/Shared Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users')); // For profile self-edit
app.use('/api/services', require('./routes/services')); // Public services view

// Role-Specific Namespaced Routes
const adminRouter = express.Router();
adminRouter.use('/users', require('./routes/admin/users'));
adminRouter.use('/services', require('./routes/admin/services'));
adminRouter.use('/requests', require('./routes/admin/requests'));
adminRouter.use('/projects', require('./routes/admin/projects'));
adminRouter.use('/stats', require('./routes/admin/stats'));
app.use('/api/admin', adminRouter);

const clientRouter = express.Router();
clientRouter.use('/projects', require('./routes/client/projects'));
clientRouter.use('/services', require('./routes/client/services'));
clientRouter.use('/requests', require('./routes/client/requests'));
clientRouter.use('/stats', require('./routes/client/stats'));
app.use('/api/client', clientRouter);

const employeeRouter = express.Router();
employeeRouter.use('/projects', require('./routes/employee/projects'));
employeeRouter.use('/stats', require('./routes/employee/stats'));
app.use('/api/employee', employeeRouter);

// Error Handling Middleware
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).json({ message: `API route ${req.originalUrl} not found` });
  } else {
    next();
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
  } else {
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
