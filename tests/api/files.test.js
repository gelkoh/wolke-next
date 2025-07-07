/**
 * @jest-environment node
 */

import { connectTestDb, disconnectTestDb, User, File, LogEntry } from '../utils/db-memory-connect';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import {
    GET as getFiles,
    POST as postFiles,
    PATCH as patchFiles,
    DELETE as deleteFiles
} from '../../src/app/api/users/[id]/files/route.js';

describe('Files API Endpoints', () => {
    let mongoServer;
    let testUserId = "testuser1";

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

    test('GET /api/users/[id]/files returns user files', async () => {
        const mockRequest = {};
        const mockContext = { params: { id: testUserId } };

        const response = await getFiles(mockRequest, mockContext);
        const files = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(files)).toBe(true);
        expect(files.length).toBeGreaterThan(0);
        expect(files[0].user_id).toBe(testUserId);
        expect(files.some(f => f.name === "document")).toBe(true);
    }, 5000);

    test('POST /api/users/[id]/files creates a new file', async () => {
        const newFileName = "newly_uploaded.txt";
        const mockRequest = {
            json: async () => ({
                name: newFileName,
                size: 50,
                type: ".txt"
            })
        };

        const mockContext = { params: { id: testUserId } };

        const response = await postFiles(mockRequest, mockContext);
        const responseBody = await response.json();

        expect(response.status).toBe(201);
        expect(responseBody.message).toBe(`File '${newFileName}' uploaded successfully!`);
        expect(responseBody.file).toHaveProperty('id');
        expect(responseBody.file.name).toBe(newFileName);

        const fileInDb = await File.findOne({ id: responseBody.file.id, user_id: testUserId });
        expect(fileInDb).not.toBeNull();
        expect(fileInDb.name).toBe(newFileName);
    }, 5000);

    test('PATCH /api/users/[id]/files renames an existing file', async () => {
        const fileToRename = await File.findOne({ user_id: testUserId, name: "document" });
        expect(fileToRename).not.toBeNull();

        const newName = "updated document";

        const mockRequest = {
            json: async () => ({
                fileId: fileToRename._id.toString(),
                newName: newName
            })
        };

        const mockContext = { params: { id: testUserId } };

        const response = await patchFiles(mockRequest, mockContext);
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody.message).toContain(newName);
        expect(responseBody.file.name).toBe(newName);

        const updatedFileInDb = await File.findById(fileToRename._id);
        expect(updatedFileInDb.name).toBe(newName);
    }, 5000);

    test('DELETE /api/users/[id]/files deletes an existing file', async () => {
        const fileToDelete = await File.create({
            id: "temp-delete-file",
            user_id: testUserId,
            name: "temp_file_to_delete.temp",
            size: 1,
            date: new Date(),
            changedate: new Date(),
            type: ".temp"
        });

        const mockRequest = {
            url: `http://localhost/api/users/${testUserId}/files?fileId=${fileToDelete._id.toString()}`,
            headers: new Headers()
        };

        const mockContext = { params: { id: testUserId } };

        const response = await deleteFiles(mockRequest, mockContext);
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody.message).toContain("deleted successfully");

        const fileInDb = await File.findById(fileToDelete._id);
        expect(fileInDb).toBeNull();
    }, 5000);

    test('DELETE /api/users/[id]/files returns 404 for non-existent file', async () => {
        const nonExistentFileId = new mongoose.Types.ObjectId().toString(); // Generiere eine gültige, aber nicht existierende _id
        const mockRequest = {
            url: `http://localhost/api/users/${testUserId}/files?fileId=${nonExistentFileId}`,
            headers: new Headers()
        };
        const mockContext = { params: { id: testUserId } };

        const response = await deleteFiles(mockRequest, mockContext);
        expect(response.status).toBe(404);
        const responseBody = await response.json();
        expect(responseBody.message).toContain("File not found");
    }, 5000);

    test('POST with invalid JSON body returns 400', async () => {
        const mockRequest = {
            json: async () => { throw new Error("Invalid JSON"); },
            text: async () => "not real json"
        };
        const mockContext = { params: { id: testUserId } };

        const response = await postFiles(mockRequest, mockContext);
        expect(response.status).toBe(400);
    });

    test('POST with missing name returns 400', async () => {
        const mockRequest = {
            json: async () => ({
                size: 123,
                type: ".txt"
            })
        };
        const mockContext = { params: { id: testUserId } };

        const response = await postFiles(mockRequest, mockContext);
        expect(response.status).toBe(400);
    });

    test('PATCH with non-existing fileId returns 404', async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();

        const mockRequest = {
            json: async () => ({
                fileId: fakeId,
                newName: "should not work"
            })
        };
        const mockContext = { params: { id: testUserId } };

        const response = await patchFiles(mockRequest, mockContext);
        expect(response.status).toBe(404);
    });

    test('DELETE without fileId returns 400', async () => {
        const mockRequest = {
            url: `http://localhost/api/users/${testUserId}/files`,
            headers: new Headers()
        };
        const mockContext = { params: { id: testUserId } };

        const response = await deleteFiles(mockRequest, mockContext);
        expect(response.status).toBe(400);
    });
}, 30000);
