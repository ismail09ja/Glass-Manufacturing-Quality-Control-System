const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/batches', require('./routes/batchRoutes'));
app.use('/api/inspection', require('./routes/inspectionRoutes'));
app.use('/api/defects', require('./routes/defectRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
