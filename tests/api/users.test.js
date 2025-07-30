/**
 * @jest-environment node
 */

import mongoose from 'mongoose';
import { GET as getUser } from '../../src/app/api/users/[id]/route.js';
import { connectTestDb, disconnectTestDb, User } from '../utils/db-memory-connect';

describe('User API Endpoint', () => {
    let testUserId = 'testuser123';

    beforeAll(async () => {
        await connectTestDb();
    });

    afterEach(async () => {
        if (mongoose.connection?.readyState === 1) {
            await User.deleteMany({});
        }

        jest.clearAllMocks();
    });

    afterAll(async () => {
        await disconnectTestDb();
        jest.restoreAllMocks();
    });

    test("GET /api/users/:id returns user by custom id", async () => {
        const testUser = await User.create({
            id: testUserId,
            username: "Test User",
            password: "testpassword",
            email: "test@example.com",
            profile_pic_url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
            storage_amount: 5000,
        });

        const mockRequest = {};
        const mockContext = { params: { id: testUserId } };

        const response = await getUser(mockRequest, mockContext);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.id).toBe(testUserId);
        expect(body.username).toBe("Test User");
        expect(body.email).toBe("test@example.com");
    });

    // test('GET /api/users/[id] returns user if found', async () => {
    //     await User.create({
    //         id: testUserId,
    //         username: 'Test User',
    //         password: 'testpassword',
    //         email: 'test@example.com',
    //         profile_pic_url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    //         storage_amount: 5000
    //     });
    //
    //     const mockRequest = {};
    //     const mockContext = { params: { id: testUserId } };
    //
    //     const response = await getUser(mockRequest, mockContext);
    //     const body = await response.json();
    //
    //     expect(response.status).toBe(200);
    //     expect(body.id).toBe(testUserId);
    //     expect(body.name).toBe('Test User');
    // });

    test('GET /api/users/[id] returns 404 if user not found', async () => {
        const mockRequest = {};
        const mockContext = { params: { id: 'nonexistent' } };

        const response = await getUser(mockRequest, mockContext);
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body.message).toContain('User not found');
    });

    test('GET /api/users/[id] handles DB connection errors gracefully', async () => {
        await mongoose.disconnect();

        mongoose.connect = jest.fn().mockRejectedValueOnce(new Error('Simulated DB error'));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const mockRequest = {};
        const mockContext = { params: { id: testUserId } };

        const response = await getUser(mockRequest, mockContext);
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body.message).toBe('Internal Server Error');
        expect(body.error).toBe('Failed to connect to database');

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'MongoDB connection error: ',
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });
});
