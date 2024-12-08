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

const testTask = {
    taskName: "Get food",
    date: "2024-12-02",
    assignedTo: "Geoffrey",
    event: 1,
};

const testTask2 = {
    taskName: "Get drinks",
    date: "2024-12-05",
    assignedTo: "Jairo",
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

describe("Task Tests", () => {
    describe("Initialization", () => {
        // PASSED
        it("should connect", async () => {
            const response1 = await request(app).get("/event");
            const response2 = await request(app).get("/tasks");
            expect(response1.statusCode).toBe(200);
            expect(response2.statusCode).toBe(200);
        });

        // PASSED
        it("should be no tasks initially", async () => {
            const response = await request(app).get("/tasks");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("Creation", () => {
        // PASSED
        it("should create a task", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app).post("/tasks").send(testTask);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                ...testTask,
                event: 1,
                id: 1,
            });
        });

        // PASSED
        it("should not create a task if no taskName is given", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app).post("/tasks").send({
                date: "2024-12-02",
                assignedTo: "Geoffrey",
                event: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "taskName",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a task if no date is given", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app).post("/tasks").send({
                taskName: "Get food",
                assignedTo: "Geoffrey",
                event: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "date",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a task if no assignedTo is given", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app).post("/tasks").send({
                taskName: "Get food",
                date: "2024-12-02",
                event: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "assignedTo",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a task if no related event is given", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app).post("/tasks").send({
                taskName: "Get food",
                date: "2024-12-02",
                assignedTo: "Geoffrey",
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
        it("should get all tasks", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/tasks").send(testTask);
            await request(app).post("/tasks").send(testTask2);

            const response = await request(app).get("/tasks");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([
                {
                    ...testTask,
                    event: {
                        eventName: "Launch Party!",
                        eventDate: "2024-01-01",
                        eventDescription: "Launch party for Event Sorcerer!",
                        id: 1,
                    },
                    id: 1,
                },
                {
                    ...testTask2,
                    event: {
                        eventName: "Launch Party!",
                        eventDate: "2024-01-01",
                        eventDescription: "Launch party for Event Sorcerer!",
                        id: 1,
                    },
                    id: 2,
                },
            ]);
        });

        // PASSED
        it("should get the task at the specified index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/tasks").send(testTask);
            await request(app).post("/tasks").send(testTask2);

            const response = await request(app).get("/tasks/2");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                ...testTask2,
                event: {
                    eventName: "Launch Party!",
                    eventDate: "2024-01-01",
                    eventDescription: "Launch party for Event Sorcerer!",
                    id: 1,
                },
                id: 2,
            });
        });

        // PASSED
        it("should not get a task due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/tasks").send(testTask);
            await request(app).post("/tasks").send(testTask2);

            const response = await request(app).get("/tasks/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("task not found");
        });
    });

    describe("Updates", () => {
        // PASSED
        it("should update the specified task's taskName", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/tasks").send(testTask);

            const response = await request(app).patch("/tasks/1").send({
                taskName: "Send out invitations",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                taskName: "Send out invitations",
                date: "2024-12-02",
                assignedTo: "Geoffrey",
                event: {
                    eventName: "Launch Party!",
                    eventDate: "2024-01-01",
                    eventDescription: "Launch party for Event Sorcerer!",
                    id: 1,
                },
                id: 1,
            });
        });

        // PASSED
        it("should update the specified task's date", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/tasks").send(testTask);

            const response = await request(app).patch("/tasks/1").send({
                date: "2024-12-10",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                taskName: "Get food",
                date: "2024-12-10",
                assignedTo: "Geoffrey",
                event: {
                    eventName: "Launch Party!",
                    eventDate: "2024-01-01",
                    eventDescription: "Launch party for Event Sorcerer!",
                    id: 1,
                },
                id: 1,
            });
        });

        // PASSED
        it("should update the specified task's assignedTo", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/tasks").send(testTask);

            const response = await request(app).patch("/tasks/1").send({
                assignedTo: "Neil",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                taskName: "Get food",
                date: "2024-12-02",
                assignedTo: "Neil",
                event: {
                    eventName: "Launch Party!",
                    eventDate: "2024-01-01",
                    eventDescription: "Launch party for Event Sorcerer!",
                    id: 1,
                },
                id: 1,
            });
        });

        // PASSED
        it("should update the specified task's related event", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/tasks").send(testTask);

            const response = await request(app).patch("/tasks/1").send({
                event: 2,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                taskName: "Get food",
                date: "2024-12-02",
                assignedTo: "Geoffrey",
                event: {
                    eventName: "Class Final",
                    eventDate: "2024-12-17",
                    eventDescription: "Final exam for our class",
                    id: 2,
                },
                id: 1,
            });
        });

        // PASSED
        it("should not update a task due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/tasks").send(testTask);

            const response = await request(app).patch("/tasks/10").send({
                taskName: "Update Successful!",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this task does not exist");
        });

        // PASSED
        it("should not update a task due to an invalid field", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/tasks").send(testTask);

            const response = await request(app).patch("/tasks/1").send({
                taskNme: "Update Successful!",
            });
            expect(response.statusCode).toBe(500);
            expect(response.body).toEqual({});
        });
    });

    describe("Deletion", () => {
        // PASSED
        it("should delete a task", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/tasks").send(testTask);

            const response = await request(app).delete("/tasks/1");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("task has been removed");
        });

        // PASSED
        it("should not delete a task due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/tasks").send(testTask);

            const response = await request(app).delete("/tasks/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this task does not exist");
        });
    });
});
