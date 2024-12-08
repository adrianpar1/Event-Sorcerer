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

const testAttendee = {
    firstName: "Mike",
    lastName: "Johnson",
    username: "test123",
    event: 1,
};

const testAttendee2 = {
    firstName: "Ben",
    lastName: "Dove",
    username: "bdove365",
    event: 1,
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

describe("Attendee Tests", () => {
    describe("Initialization", () => {
        // PASSED
        it("should connect", async () => {
            const response1 = await request(app).get("/event");
            const response2 = await request(app).get("/attendees");
            expect(response1.statusCode).toBe(200);
            expect(response2.statusCode).toBe(200);
        });

        // PASSED
        it("should be no attendees initially", async () => {
            const response = await request(app).get("/attendees");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("Creation", () => {
        // PASSED
        it("should create an attendee", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app)
                .post("/attendees")
                .send(testAttendee);
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({ ...testAttendee, id: 1 });
        });

        // PASSED
        it("should not create an attendee if no firstName is given", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app).post("/attendees").send({
                lastName: "Johnson",
                username: "test123",
                event: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "firstName",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create an attendee if no lastName is given", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app).post("/attendees").send({
                firstName: "Mike",
                username: "test123",
                event: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "lastName",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create an attendee if no username is given", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app).post("/attendees").send({
                firstName: "Mike",
                lastName: "Johnson",
                event: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "username",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create an attendee if no related event is given", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app).post("/attendees").send({
                firstName: "Mike",
                lastName: "Johnson",
                username: "test123",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "event",
                location: "body",
                type: "field",
            });
        });
    });

    describe("Retrieval", () => {
        // PASSED
        it("should get all attendees", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/attendees").send(testAttendee);
            await request(app).post("/attendees").send(testAttendee2);

            const response = await request(app).get("/attendees");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([
                {
                    ...testAttendee,
                    event: { ...testEvent, id: 1 },
                    id: 1,
                },
                {
                    ...testAttendee2,
                    event: { ...testEvent, id: 1 },
                    id: 2,
                },
            ]);
        });

        // PASSED
        it("should get the attendee for the specified index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/attendees").send(testAttendee);
            await request(app).post("/attendees").send(testAttendee2);

            const response = await request(app).get("/attendees/2");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                ...testAttendee2,
                event: { ...testEvent, id: 1 },
                id: 2,
            });
        });

        // PASSED
        it("should not get the attendee due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/attendees").send(testAttendee);
            await request(app).post("/attendees").send(testAttendee2);

            const response = await request(app).get("/attendees/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("no attendee found");
        });
    });

    describe("Updates", () => {
        // PASSED
        it("should update the specified attendee's firstName", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/attendees").send(testAttendee);

            const response = await request(app).patch("/attendees/1").send({
                firstName: "Adam",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                firstName: "Adam",
                lastName: "Johnson",
                username: "test123",
                event: { ...testEvent, id: 1 },
                id: 1,
            });
        });

        // PASSED
        it("should update the specified attendee's lastName", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/attendees").send(testAttendee);

            const response = await request(app).patch("/attendees/1").send({
                lastName: "Apple",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                firstName: "Mike",
                lastName: "Apple",
                username: "test123",
                event: { ...testEvent, id: 1 },
                id: 1,
            });
        });

        // PASSED
        it("should update the specified attendee's username", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/attendees").send(testAttendee);

            const response = await request(app).patch("/attendees/1").send({
                username: "newUser5",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                firstName: "Mike",
                lastName: "Johnson",
                username: "newUser5",
                event: { ...testEvent, id: 1 },
                id: 1,
            });
        });

        // PASSED
        it("should update the specified attendee's related event", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/attendees").send(testAttendee);

            const response = await request(app).patch("/attendees/1").send({
                event: 2,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                firstName: "Mike",
                lastName: "Johnson",
                username: "test123",
                event: { ...testEvent2, id: 2 },
                id: 1,
            });
        });

        // PASSED
        it("should not update an attendee due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/attendees").send(testAttendee);

            const response = await request(app).patch("/attendees/10").send({
                firstName: "Adam",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this attendee does not exist");
        });

        // PASSED
        it("should not update an attendee due to an invalid field", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/attendees").send(testAttendee);

            const response = await request(app).patch("/attendees/1").send({
                firstNme: "Adam",
            });
            expect(response.statusCode).toBe(500);
            expect(response.body).toEqual({});
        });
    });

    describe("Deletion", () => {
        // PASSED
        it("should delete an attendee", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/attendees").send(testAttendee);

            const response = await request(app).delete("/attendees/1");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("attendee has been removed");
        });

        // PASSED
        it("should not delete an attendee due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/attendees").send(testAttendee);

            const response = await request(app).delete("/attendees/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this attendee does not exist");
        });
    });
});
