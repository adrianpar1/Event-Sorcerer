import { clear } from "console";
import app from "../../src/app";
import { port } from "../../src/config";
import { AppDataSource } from "../../src/data-source";
import * as request from "supertest";
import { EventDetailsController } from "../../src/controller/EventDetailsController";

// NOTE: work in progress; not finished

let connection, server;

const testEvent = {
    eventName: "Launch Party!",
    eventDate: "2024-01-01",
    eventTime: "21:21:59",
    eventLocation: "Duncan Hall 318",
    eventDescription: "Launch party for Event Sorcerer!",
    rsvpLink: "https://fakenews.com",
    rsvpDueDate: "2024-01-03",
    rsvpDueTime: "23:59:59",
};

beforeEach(async () => {
    connection = await AppDataSource.initialize();
    await connection.synchronize(true);
    server = app.listen(port);
});

afterEach(() => {
    connection.close();
    server.close();
});

describe("EventDetails Tests", () => {
    // PASSED
    it("should be connecting", async () => {
        const response = await request(app).get("/event");
        expect(response.statusCode).toBe(200);
    });

    // PASSED
    it("should be no events initially", async () => {
        const response = await request(app).get("/event");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    // PASSED
    it("should create an event", async () => {
        const response = await request(app).post("/event").send(testEvent);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ ...testEvent, id: 1 });
    });

    // PASSED
    it("should not create an event if no eventName is given", async () => {
        const response = await request(app).post("/event").send({
            eventDate: "2024-01-01",
            eventTime: "21:21:59",
            eventLocation: "Duncan Hall 318",
            eventDescription: "Launch party for Event Sorcerer!",
            rsvpLink: "https://fakenews.com",
            rsvpDueDate: "2024-01-03",
            rsvpDueTime: "23:59:59",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0]).toEqual({
            msg: "Invalid value",
            path: "eventName",
            location: "body",
            type: "field",
        });
    });

    // PASSED
    it("should not create an event if no eventDate is given", async () => {
        const response = await request(app).post("/event").send({
            eventName: "Launch Party!",
            eventTime: "21:21:59",
            eventLocation: "Duncan Hall 318",
            eventDescription: "Launch party for Event Sorcerer!",
            rsvpLink: "https://fakenews.com",
            rsvpDueDate: "2024-01-03",
            rsvpDueTime: "23:59:59",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0]).toEqual({
            msg: "Invalid value",
            path: "eventDate",
            location: "body",
            type: "field",
        });
    });

    // PASSED
    it("should not create an event if no eventTime is given", async () => {
        const response = await request(app).post("/event").send({
            eventName: "Launch Party!",
            eventDate: "2024-01-01",
            eventLocation: "Duncan Hall 318",
            eventDescription: "Launch party for Event Sorcerer!",
            rsvpLink: "https://fakenews.com",
            rsvpDueDate: "2024-01-03",
            rsvpDueTime: "23:59:59",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0]).toEqual({
            msg: "Invalid value",
            path: "eventTime",
            location: "body",
            type: "field",
        });
    });

    // PASSED
    it("should not create an event if no eventLocation is given", async () => {
        const response = await request(app).post("/event").send({
            eventName: "Launch Party!",
            eventDate: "2024-01-01",
            eventTime: "21:21:59",
            eventDescription: "Launch party for Event Sorcerer!",
            rsvpLink: "https://fakenews.com",
            rsvpDueDate: "2024-01-03",
            rsvpDueTime: "23:59:59",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0]).toEqual({
            msg: "Invalid value",
            path: "eventLocation",
            location: "body",
            type: "field",
        });
    });

    // PASSED
    it("should not create an event if no eventDescription is given", async () => {
        const response = await request(app).post("/event").send({
            eventName: "Launch Party!",
            eventDate: "2024-01-01",
            eventTime: "21:21:59",
            eventLocation: "Duncan Hall 318",
            rsvpLink: "https://fakenews.com",
            rsvpDueDate: "2024-01-03",
            rsvpDueTime: "23:59:59",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0]).toEqual({
            msg: "Invalid value",
            path: "eventDescription",
            location: "body",
            type: "field",
        });
    });

    // PASSED
    it("should not create an event if no rsvpLink is given", async () => {
        const response = await request(app).post("/event").send({
            eventName: "Launch Party!",
            eventDate: "2024-01-01",
            eventTime: "21:21:59",
            eventLocation: "Duncan Hall 318",
            eventDescription: "Launch party for Event Sorcerer!",
            rsvpDueDate: "2024-01-03",
            rsvpDueTime: "23:59:59",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0]).toEqual({
            msg: "Invalid value",
            path: "rsvpLink",
            location: "body",
            type: "field",
        });
    });

    // PASSED
    it("should not create an event if no rsvpDueDate is given", async () => {
        const response = await request(app).post("/event").send({
            eventName: "Launch Party!",
            eventDate: "2024-01-01",
            eventTime: "21:21:59",
            eventLocation: "Duncan Hall 318",
            eventDescription: "Launch party for Event Sorcerer!",
            rsvpLink: "https://fakenews.com",
            rsvpDueTime: "23:59:59",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0]).toEqual({
            msg: "Invalid value",
            path: "rsvpDueDate",
            location: "body",
            type: "field",
        });
    });

    // PASSED
    it("should not create an event if no rsvpDueTime is given", async () => {
        const response = await request(app).post("/event").send({
            eventName: "Launch Party!",
            eventDate: "2024-01-01",
            eventTime: "21:21:59",
            eventLocation: "Duncan Hall 318",
            eventDescription: "Launch party for Event Sorcerer!",
            rsvpLink: "https://fakenews.com",
            rsvpDueDate: "2024-01-03",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0]).toEqual({
            msg: "Invalid value",
            path: "rsvpDueTime",
            location: "body",
            type: "field",
        });
    });
});
