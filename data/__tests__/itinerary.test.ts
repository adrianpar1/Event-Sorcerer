import app from "../src/app";
import { port } from "../src/config";
import { AppDataSource } from "../src/data-source";
import * as request from "supertest";

let connection, server;

const testSubevent = {
    subeventName: "Attend class",
    subeventDate: "2024-12-06",
    subeventTime: "10:30:30",
    subeventPoc: "Geoffrey Agustin",
    subeventDescription: "We should all go to class.",
    eventId: 2,
    subeventOrder: 1,
};

const testSubevent2 = {
    subeventName: "Do final presentation",
    subeventDate: "2024-12-06",
    subeventTime: "11:15:50",
    subeventPoc: "Kenrick Doan",
    subeventDescription: "Present our final project in front of the class.",
    eventId: 2,
    subeventOrder: 2,
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

describe("Itinerary Tests", () => {
    describe("Initialization", () => {
        // PASSED
        it("should connect", async () => {
            const response = await request(app).get("/itinerary");
            expect(response.statusCode).toBe(200);
        });

        // PASSED
        it("should be no subevents initially", async () => {
            const response = await request(app).get("/itinerary");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("Creation", () => {
        // PASSED
        it("should create a subevent", async () => {
            const response = await request(app)
                .post("/itinerary")
                .send(testSubevent);
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({ ...testSubevent, id: 1 });
        });

        // PASSED
        it("should not create a subevent if no subeventName is given", async () => {
            const response = await request(app).post("/itinerary").send({
                subeventDate: "2024-12-06",
                subeventTime: "10:30:30",
                subeventPoc: "Geoffrey Agustin",
                subeventDescription: "We should all go to class.",
                eventId: 2,
                subeventOrder: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "subeventName",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a subevent if no subeventDate is given", async () => {
            const response = await request(app).post("/itinerary").send({
                subeventName: "Attend class",
                subeventTime: "10:30:30",
                subeventPoc: "Geoffrey Agustin",
                subeventDescription: "We should all go to class.",
                eventId: 2,
                subeventOrder: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "subeventDate",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a subevent if no subeventTime is given", async () => {
            const response = await request(app).post("/itinerary").send({
                subeventName: "Attend class",
                subeventDate: "2024-12-06",
                subeventPoc: "Geoffrey Agustin",
                subeventDescription: "We should all go to class.",
                eventId: 2,
                subeventOrder: 1,
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
        it("should not create a subevent if no subeventPoc is given", async () => {
            const response = await request(app).post("/itinerary").send({
                subeventName: "Attend class",
                subeventDate: "2024-12-06",
                subeventTime: "10:30:30",
                subeventDescription: "We should all go to class.",
                eventId: 2,
                subeventOrder: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "subeventPoc",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a subevent if no subeventDescription is given", async () => {
            const response = await request(app).post("/itinerary").send({
                subeventName: "Attend class",
                subeventDate: "2024-12-06",
                subeventTime: "10:30:30",
                subeventPoc: "Geoffrey Agustin",
                eventId: 2,
                subeventOrder: 1,
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
        it("should not create a subevent if no eventId is given", async () => {
            const response = await request(app).post("/itinerary").send({
                subeventName: "Attend class",
                subeventDate: "2024-12-06",
                subeventTime: "10:30:30",
                subeventPoc: "Geoffrey Agustin",
                subeventDescription: "We should all go to class.",
                subeventOrder: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "eventId",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a subevent if no subeventOrder is given", async () => {
            const response = await request(app).post("/itinerary").send({
                subeventName: "Attend class",
                subeventDate: "2024-12-06",
                subeventTime: "10:30:30",
                subeventPoc: "Geoffrey Agustin",
                subeventDescription: "We should all go to class.",
                eventId: 2,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "subeventOrder",
                location: "body",
                type: "field",
            });
        });
    });

    describe("Retrieval", () => {
        // PASSED
        it("should get all subevents", async () => {
            await request(app).post("/itinerary").send(testSubevent);
            await request(app).post("/itinerary").send(testSubevent2);

            const response = await request(app).get("/itinerary");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([
                { ...testSubevent, id: 1 },
                { ...testSubevent2, id: 2 },
            ]);
        });

        // PASSED
        it("should get the subevent at the specified index", async () => {
            await request(app).post("/itinerary").send(testSubevent);
            await request(app).post("/itinerary").send(testSubevent2);

            const response = await request(app).get("/itinerary/2");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ ...testSubevent2, id: 2 });
        });

        // PASSED
        it("should not get the subevent due to an invalid index", async () => {
            await request(app).post("/itinerary").send(testSubevent);
            await request(app).post("/itinerary").send(testSubevent2);

            const response = await request(app).get("/itinerary/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("no subevent details found");
        });
    });

    describe("Updates", () => {
        // PASSED
        it("should update the specified subevent's subeventName", async () => {
            await request(app).post("/itinerary").send(testSubevent);

            const response = await request(app).patch("/itinerary/1").send({
                subeventName: "Not going to class",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                subeventName: "Not going to class",
                subeventDate: "2024-12-06",
                subeventTime: "10:30:30",
                subeventPoc: "Geoffrey Agustin",
                subeventDescription: "We should all go to class.",
                eventId: 2,
                subeventOrder: 1,
                id: 1,
            });
        });

        // PASSED
        it("should update the specified subevent's subeventDate", async () => {
            await request(app).post("/itinerary").send(testSubevent);

            const response = await request(app).patch("/itinerary/1").send({
                subeventDate: "2024-12-18",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                subeventName: "Attend class",
                subeventDate: "2024-12-18",
                subeventTime: "10:30:30",
                subeventPoc: "Geoffrey Agustin",
                subeventDescription: "We should all go to class.",
                eventId: 2,
                subeventOrder: 1,
                id: 1,
            });
        });

        // PASSED
        it("should update the specified subevent's subeventTime", async () => {
            await request(app).post("/itinerary").send(testSubevent);

            const response = await request(app).patch("/itinerary/1").send({
                subeventTime: "11:45:45",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                subeventName: "Attend class",
                subeventDate: "2024-12-06",
                subeventTime: "11:45:45",
                subeventPoc: "Geoffrey Agustin",
                subeventDescription: "We should all go to class.",
                eventId: 2,
                subeventOrder: 1,
                id: 1,
            });
        });

        // PASSED
        it("should update the specified subevent's subeventPoc", async () => {
            await request(app).post("/itinerary").send(testSubevent);

            const response = await request(app).patch("/itinerary/1").send({
                subeventPoc: "Jairo Manansala",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                subeventName: "Attend class",
                subeventDate: "2024-12-06",
                subeventTime: "10:30:30",
                subeventPoc: "Jairo Manansala",
                subeventDescription: "We should all go to class.",
                eventId: 2,
                subeventOrder: 1,
                id: 1,
            });
        });

        // PASSED
        it("should update the specified subevent's subeventDescription", async () => {
            await request(app).post("/itinerary").send(testSubevent);

            const response = await request(app).patch("/itinerary/1").send({
                subeventDescription: "Let's not go to class anymore.",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                subeventName: "Attend class",
                subeventDate: "2024-12-06",
                subeventTime: "10:30:30",
                subeventPoc: "Geoffrey Agustin",
                subeventDescription: "Let's not go to class anymore.",
                eventId: 2,
                subeventOrder: 1,
                id: 1,
            });
        });

        // PASSED
        it("should update the specified subevent's eventId", async () => {
            await request(app).post("/itinerary").send(testSubevent);

            const response = await request(app).patch("/itinerary/1").send({
                eventId: 5,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                subeventName: "Attend class",
                subeventDate: "2024-12-06",
                subeventTime: "10:30:30",
                subeventPoc: "Geoffrey Agustin",
                subeventDescription: "We should all go to class.",
                eventId: 5,
                subeventOrder: 1,
                id: 1,
            });
        });

        // PASSED
        it("should update the specified subevent's subeventOrder", async () => {
            await request(app).post("/itinerary").send(testSubevent);

            const response = await request(app).patch("/itinerary/1").send({
                subeventOrder: 2,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                subeventName: "Attend class",
                subeventDate: "2024-12-06",
                subeventTime: "10:30:30",
                subeventPoc: "Geoffrey Agustin",
                subeventDescription: "We should all go to class.",
                eventId: 2,
                subeventOrder: 2,
                id: 1,
            });
        });

        // PASSED
        it("should not update a subevent due to an invalid index", async () => {
            await request(app).post("/itinerary").send(testSubevent);

            const response = await request(app).patch("/itinerary/10").send({
                subeventName: "Not going to class",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this subevent does not exist");
        });

        // PASSED
        it("should not update a subevent due to an invalid field", async () => {
            await request(app).post("/itinerary").send(testSubevent);

            const response = await request(app).patch("/itinerary/1").send({
                subeventNme: "Not going to class",
            });
            expect(response.statusCode).toBe(500);
            expect(response.body).toEqual({});
        });
    });

    describe("Deletion", () => {
        // PASSED
        it("should delete a subevent", async () => {
            await request(app).post("/itinerary").send(testSubevent);

            const response = await request(app).delete("/itinerary/1");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("subevent has been removed");
        });

        // PASSED
        it("should not delete a subevent due to an invalid index", async () => {
            await request(app).post("/itinerary").send(testSubevent);

            const response = await request(app).delete("/itinerary/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this subevent does not exist");
        });
    });
});
