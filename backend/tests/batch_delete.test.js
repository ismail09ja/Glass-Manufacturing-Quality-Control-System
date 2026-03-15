const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Batch = require('../models/Batch');
const jwt = require('jsonwebtoken');

describe('Batch Deletion', () => {
    let adminToken;
    let userToken;
    let batchId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
        await User.deleteMany({});
        await Batch.deleteMany({});

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

        const user = await User.create({
            name: 'Regular User',
            email: 'user@example.com',
            password: 'password123',
            role: 'inspector'
        });

        adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
        userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        const batch = await Batch.create({
            batchId: 'B-TEST-DELETE',
            furnaceTemperature: 1500,
            rawMaterialComposition: 'Test Comp',
            productionDate: new Date(),
            productionLine: 'Line A',
            shift: 'morning',
            operatorName: 'Test Op'
        });
        batchId = batch._id;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should not allow non-admin to delete batch', async () => {
        const res = await request(app)
            .delete(`/api/batches/${batchId}`)
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(403);
    });

    it('should allow admin to delete batch', async () => {
        const res = await request(app)
            .delete(`/api/batches/${batchId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Batch deleted successfully');
    });

    it('should return 404 for non-existent batch', async () => {
        const res = await request(app)
            .delete(`/api/batches/${new mongoose.Types.ObjectId()}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
    });
});
