import app from "../src/app";
import { port } from "../src/config";
import { AppDataSource } from "../src/data-source";
import * as request from "supertest";

let connection, server;

const testEvent = {
    eventName: "Launch Party!",
    eventDate: "2024-01-01",
    eventDescription: "Launch party for Event Sorcerer!",
};

const testEvent2 = {
    eventName: "Class Final",
    eventDate: "2024-12-17",
    eventDescription: "Final exam for our class",
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

describe("Event Tests", () => {
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
                eventDescription: "Launch party for Event Sorcerer!",
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
                eventDescription: "Launch party for Event Sorcerer!",
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
        it("should not create an event if no eventDescription is given", async () => {
            const response = await request(app).post("/event").send({
                eventName: "Launch Party!",
                eventDate: "2024-01-01",
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
    });

    describe("Retrieval", () => {
        // PASSED
        it("should get all events", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);

            const response = await request(app).get("/event");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([
                {
                    ...testEvent,
                    attendees: [],
                    budget: null,
                    subevents: [],
                    tasks: [],
                    id: 1,
                },
                {
                    ...testEvent2,
                    attendees: [],
                    budget: null,
                    subevents: [],
                    tasks: [],
                    id: 2,
                },
            ]);
        });

        // PASSED
        it("should get the event at the specified index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);

            const response = await request(app).get("/event/2");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                ...testEvent2,
                attendees: [],
                budget: null,
                subevents: [],
                tasks: [],
                id: 2,
            });
        });

        // PASSED
        it("should not get an event due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);

            const response = await request(app).get("/event/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("no event details found");
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
                eventDescription: "Launch party for Event Sorcerer!",
                attendees: [],
                budget: null,
                subevents: [],
                tasks: [],
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
                eventDescription: "Launch party for Event Sorcerer!",
                attendees: [],
                budget: null,
                subevents: [],
                tasks: [],
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
                eventDescription: "We're finally launching the app!",
                attendees: [],
                budget: null,
                subevents: [],
                tasks: [],
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
            expect(response.body).toEqual("this event does not exist");
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
            expect(response.body).toEqual("event has been removed");
        });

        // PASSED
        it("should not delete an event due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);

            const response = await request(app).delete("/event/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this event does not exist");
        });
    });
});
