const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const batchRoutes = require('./routes/batchRoutes');
const inspectionRoutes = require('./routes/inspectionRoutes');
const defectRoutes = require('./routes/defectRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// MongoDB Connection
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        
        // If no URI is provided, or if specifically set to 'local', use Memory Server
        if (!mongoUri || mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) {
            console.log('📡 Starting Local In-Memory Database...');
            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
            console.log('✅ Connected to Mock MongoDB (Local In-Memory Mode)');
            console.log('💡 Note: Data is saved only while the server is running.');
        } else {
            console.log('📡 Connecting to Remote MongoDB Atlas...');
            await mongoose.connect(mongoUri, { 
                serverSelectionTimeoutMS: 5000 
            });
            console.log('✅ Connected to MongoDB Atlas (Production-Ready)');
        }
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('⚠️  Falling back to In-Memory Database because the connection failed.');
        try {
            const mongoServer = await MongoMemoryServer.create();
            await mongoose.connect(mongoServer.getUri());
            console.log('✅ Connected to Mock MongoDB (Fallback Mode)');
        } catch (fallbackErr) {
            console.error('🛑 Fatal Database Error:', fallbackErr.message);
            process.exit(1);
        }
    }
};

connectDB();

// Root Route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Glass Quality Control API',
        status: 'Healthy',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            batches: '/api/batches',
            inspections: '/api/inspections',
            defects: '/api/defects',
            analytics: '/api/analytics'
        },
        timestamp: new Date()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/defects', defectRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}`);
});
