/**
 * @jest-environment node
 */

import { connectTestDb, disconnectTestDb, User, LogEntry } from '../utils/db-memory-connect';
import { MongoMemoryServer } from 'mongodb-memory-server'; 
import mongoose from 'mongoose';

import { GET as getLogs } from '../../src/app/log/route.js';


describe('Log API Endpoints', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await connectTestDb();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await disconnectTestDb();
        jest.restoreAllMocks();
    });

    test('GET /log returns empty array if no logs found for undefined user_id', async () => {
        
        const mockRequest = {};
        const mockContext = { params: {} }; 

        const response = await getLogs(mockRequest, mockContext);
        const logs = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(logs)).toBe(true);
        expect(logs.length).toBe(0);
    }, 5000);

    test('GET /log handles database connection errors gracefully', async () => {
        await mongoose.disconnect();

        mongoose.connect = jest.fn().mockRejectedValueOnce(new Error("Simulated connection error"));

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const mockRequest = {};
        const mockContext = { params: {} }; 

        const response = await getLogs(mockRequest, mockContext);
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody.message).toBe("Internal Server Error");
        expect(responseBody.error).toBe("Failed to connect to database");
        expect(mongoose.connect).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "MongoDB connection error: ",
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();

        await connectTestDb();
    }, 5000);

}, 30000);
