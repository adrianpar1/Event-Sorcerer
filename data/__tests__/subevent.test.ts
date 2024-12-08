import app from "../src/app";
import { port } from "../src/config";
import { AppDataSource } from "../src/data-source";
import * as request from "supertest";

let connection, server;

// needs to be sent with every case or else relation will not work correctly
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

const testSubevent = {
    subeventTime: "10:30",
    subeventDescription: "Begin presentation",
    event: 1,
};

const testSubevent2 = {
    subeventTime: "10:45",
    subeventDescription: "End presentation",
    event: 2,
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

describe("Subevent Tests", () => {
    describe("Initialization", () => {
        // PASSED
        it("should connect", async () => {
            const response = await request(app).get("/subevents");
            expect(response.statusCode).toBe(200);
        });

        // PASSED
        it("should be no subevents initially", async () => {
            const response = await request(app).get("/subevents");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("Creation", () => {
        // PASSED
        it("should create a subevent", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app)
                .post("/subevents")
                .send(testSubevent);
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                ...testSubevent,
                event: 1,
                id: 1,
            });
        });

        // PASSED
        it("should not create a subevent if no subeventTime is given", async () => {
            const response = await request(app).post("/subevents").send({
                subeventDescription: "We should all go to class.",
                event: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "subeventTime",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a subevent if no subeventDescription is given", async () => {
            const response = await request(app).post("/subevents").send({
                subeventTime: "10:30",
                event: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "subeventDescription",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a subevent if no related event is given", async () => {
            const response = await request(app).post("/subevents").send({
                subeventTime: "10:30",
                subeventDescription: "Begin presentation",
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
        it("should get all subevents", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/subevents").send(testSubevent);
            await request(app).post("/subevents").send(testSubevent2);

            const response = await request(app).get("/subevents");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([
                {
                    ...testSubevent,
                    event: { ...testEvent, id: 1 },
                    subeventTime: "10:30:00",
                    id: 1,
                },
                {
                    ...testSubevent2,
                    event: { ...testEvent2, id: 2 },
                    subeventTime: "10:45:00",
                    id: 2,
                },
            ]);
        });

        // PASSED
        it("should get the subevent at the specified index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/subevents").send(testSubevent);
            await request(app).post("/subevents").send(testSubevent2);

            const response = await request(app).get("/subevents/2");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                ...testSubevent2,
                event: { ...testEvent2, id: 2 },
                subeventTime: "10:45:00",
                id: 2,
            });
        });

        // PASSED
        it("should not get the subevent due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/subevents").send(testSubevent);
            await request(app).post("/subevents").send(testSubevent2);

            const response = await request(app).get("/subevents/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("no subevent details found");
        });
    });

    describe("Updates", () => {
        // PASSED
        it("should update the specified subevent's subeventTime", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/subevents").send(testSubevent);

            const response = await request(app).patch("/subevents/1").send({
                subeventTime: "10:40",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                subeventTime: "10:40:00",
                subeventDescription: "Begin presentation",
                event: { ...testEvent, id: 1 },
                id: 1,
            });
        });

        // PASSED
        it("should update the specified subevent's subeventDescription", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/subevents").send(testSubevent);

            const response = await request(app).patch("/subevents/1").send({
                subeventDescription: "Review presentation",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                subeventTime: "10:30:00",
                subeventDescription: "Review presentation",
                event: { ...testEvent, id: 1 },
                id: 1,
            });
        });

        // PASSED
        it("should update the specified subevent's related event", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/subevents").send(testSubevent);

            const response = await request(app).patch("/subevents/1").send({
                event: 2,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                subeventTime: "10:30:00",
                subeventDescription: "Begin presentation",
                event: { ...testEvent2, id: 2 },
                id: 1,
            });
        });

        // PASSED
        it("should not update a subevent due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/subevents").send(testSubevent);

            const response = await request(app).patch("/subevents/10").send({
                subeventName: "Review presentation",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this subevent does not exist");
        });

        // PASSED
        it("should not update a subevent due to an invalid field", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/subevents").send(testSubevent);

            const response = await request(app).patch("/subevents/1").send({
                subeventNme: "Review presentation",
            });
            expect(response.statusCode).toBe(500);
            expect(response.body).toEqual({});
        });
    });

    describe("Deletion", () => {
        // PASSED
        it("should delete a subevent", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/subevents").send(testSubevent);

            const response = await request(app).delete("/subevents/1");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("subevent has been removed");
        });

        // PASSED
        it("should not delete a subevent due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/subevents").send(testSubevent);

            const response = await request(app).delete("/subevents/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this subevent does not exist");
        });
    });
});
