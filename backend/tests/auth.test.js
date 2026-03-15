const request = require('supertest');

// Mock mongoose before requiring app
jest.mock('../config/db', () => jest.fn());

// Mock all models
jest.mock('../models/User');
jest.mock('../models/Batch');
jest.mock('../models/QualityInspection');
jest.mock('../models/Defect');
jest.mock('../models/Alert');

const User = require('../models/User');
const app = require('../server');

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({
                _id: '507f1f77bcf86cd799439011',
                name: 'Test User',
                email: 'test@example.com',
                role: 'admin',
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'admin',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.name).toBe('Test User');
        });

        it('should return 400 if user exists', async () => {
            User.findOne.mockResolvedValue({ email: 'test@example.com' });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return 401 for invalid credentials', async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'wrong@example.com', password: 'wrong' });

            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/health', () => {
        it('should return health status', async () => {
            const res = await request(app).get('/api/health');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('ok');
        });
    });
});
