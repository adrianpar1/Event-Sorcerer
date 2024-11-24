import { clear } from "console";
import app from "../src/app";
import { port } from "../src/config";
import { AppDataSource } from "../src/data-source";
import * as request from "supertest";

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
    describe("Initialization", () => {
        // PASSED
        it("should connect", async () => {
            const response = await request(app).get("/event");
            expect(response.statusCode).toBe(200);
        });

        // PASSED
        it("should be no events initially", async () => {
            const response = await request(app).get("/event");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("Creation", () => {
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

    describe("Updates", () => {
        // PASSED
        it("should update the specified event's eventName", async () => {
            await request(app).post("/event").send(testEvent);

            const response = await request(app).patch("/event/1").send({
                eventName: "Update Successful!",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                eventName: "Update Successful!",
                eventDate: "2024-01-01",
                eventTime: "21:21:59",
                eventLocation: "Duncan Hall 318",
                eventDescription: "Launch party for Event Sorcerer!",
                rsvpLink: "https://fakenews.com",
                rsvpDueDate: "2024-01-03",
                rsvpDueTime: "23:59:59",
                id: 1,
            });
        });

        // PASSED
        it("should update the specified event's eventDate", async () => {
            await request(app).post("/event").send(testEvent);

            const response = await request(app).patch("/event/1").send({
                eventDate: "2024-04-01",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                eventName: "Launch Party!",
                eventDate: "2024-04-01",
                eventTime: "21:21:59",
                eventLocation: "Duncan Hall 318",
                eventDescription: "Launch party for Event Sorcerer!",
                rsvpLink: "https://fakenews.com",
                rsvpDueDate: "2024-01-03",
                rsvpDueTime: "23:59:59",
                id: 1,
            });
        });

        // PASSED
        it("should update the specified event's eventTime", async () => {
            await request(app).post("/event").send(testEvent);

            const response = await request(app).patch("/event/1").send({
                eventTime: "10:30:30",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                eventName: "Launch Party!",
                eventDate: "2024-01-01",
                eventTime: "10:30:30",
                eventLocation: "Duncan Hall 318",
                eventDescription: "Launch party for Event Sorcerer!",
                rsvpLink: "https://fakenews.com",
                rsvpDueDate: "2024-01-03",
                rsvpDueTime: "23:59:59",
                id: 1,
            });
        });

        // PASSED
        it("should update the specified event's eventLocation", async () => {
            await request(app).post("/event").send(testEvent);

            const response = await request(app).patch("/event/1").send({
                eventLocation: "Tower Lawn",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                eventName: "Launch Party!",
                eventDate: "2024-01-01",
                eventTime: "21:21:59",
                eventLocation: "Tower Lawn",
                eventDescription: "Launch party for Event Sorcerer!",
                rsvpLink: "https://fakenews.com",
                rsvpDueDate: "2024-01-03",
                rsvpDueTime: "23:59:59",
                id: 1,
            });
        });

        // PASSED
        it("should update the specified event's eventDescription", async () => {
            await request(app).post("/event").send(testEvent);

            const response = await request(app).patch("/event/1").send({
                eventDescription: "We're finally launching the app!",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                eventName: "Launch Party!",
                eventDate: "2024-01-01",
                eventTime: "21:21:59",
                eventLocation: "Duncan Hall 318",
                eventDescription: "We're finally launching the app!",
                rsvpLink: "https://fakenews.com",
                rsvpDueDate: "2024-01-03",
                rsvpDueTime: "23:59:59",
                id: 1,
            });
        });

        // PASSED
        it("should update the specified event's rsvpLink", async () => {
            await request(app).post("/event").send(testEvent);

            const response = await request(app).patch("/event/1").send({
                rsvpLink: "https://notrealnews.com",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                eventName: "Launch Party!",
                eventDate: "2024-01-01",
                eventTime: "21:21:59",
                eventLocation: "Duncan Hall 318",
                eventDescription: "Launch party for Event Sorcerer!",
                rsvpLink: "https://notrealnews.com",
                rsvpDueDate: "2024-01-03",
                rsvpDueTime: "23:59:59",
                id: 1,
            });
        });

        // PASSED
        it("should update the specified event's rsvpDueDate", async () => {
            await request(app).post("/event").send(testEvent);

            const response = await request(app).patch("/event/1").send({
                rsvpDueDate: "2024-02-05",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                eventName: "Launch Party!",
                eventDate: "2024-01-01",
                eventTime: "21:21:59",
                eventLocation: "Duncan Hall 318",
                eventDescription: "Launch party for Event Sorcerer!",
                rsvpLink: "https://fakenews.com",
                rsvpDueDate: "2024-02-05",
                rsvpDueTime: "23:59:59",
                id: 1,
            });
        });

        // PASSED
        it("should update the specified event's rsvpDueTime", async () => {
            await request(app).post("/event").send(testEvent);

            const response = await request(app).patch("/event/1").send({
                rsvpDueTime: "01:01:01",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                eventName: "Launch Party!",
                eventDate: "2024-01-01",
                eventTime: "21:21:59",
                eventLocation: "Duncan Hall 318",
                eventDescription: "Launch party for Event Sorcerer!",
                rsvpLink: "https://fakenews.com",
                rsvpDueDate: "2024-01-03",
                rsvpDueTime: "01:01:01",
                id: 1,
            });
        });

        // PASSED
        it("should not update an event due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);

            const response = await request(app).patch("/event/10").send({
                eventName: "Update Successful!",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("these event details do not exist");
        });

        // PASSED
        it("should not update an event due to an invalid field", async () => {
            await request(app).post("/event").send(testEvent);

            const response = await request(app).patch("/event/1").send({
                eventNme: "Update Successful!",
            });
            expect(response.statusCode).toBe(500);
            expect(response.body).toEqual({});
        });
    });

    describe("Deletion", () => {
        // PASSED
        it("should delete an event", async () => {
            await request(app).post("/event").send(testEvent);

            const response = await request(app).delete("/event/1");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("event details have been removed");
        });

        // PASSED
        it("should not delete an event due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);

            const response = await request(app).delete("/event/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("these event details do not exist");
        });
    });
});

// ADD Retrieval (GET) tests
