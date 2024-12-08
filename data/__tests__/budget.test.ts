import app from "../src/app";
import { port } from "../src/config";
import { AppDataSource } from "../src/data-source";
import * as request from "supertest";
import { BudgetItem } from "../src/entity/BudgetItem";

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

const testBudget = {
    totalBudget: 100,
    event: 1,
};

const testBudget2 = {
    totalBudget: 200,
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

describe("Budget Tests", () => {
    describe("Initialization", () => {
        // PASSED
        it("should connect", async () => {
            const response1 = await request(app).get("/event");
            const response2 = await request(app).get("/budget");
            expect(response1.statusCode).toBe(200);
            expect(response2.statusCode).toBe(200);
        });

        // PASSED
        it("should be no budget initially", async () => {
            const response = await request(app).get("/budget");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("Creation", () => {
        // PASSED
        it("should create a budget", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app)
                .post("/budget")
                .send(testBudget);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                ...testBudget,
                id: 1,
            });
        });

        // PASSED
        it("should not create a budget if no totalBudget is given", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app).post("/budget").send({
                event: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "totalBudget",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a budget if no related event is given", async () => {
            await request(app).post("/event").send(testEvent);
            const response = await request(app).post("/budget").send({
                totalBudget: "100",
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
        it("should get all budgets", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/budget").send(testBudget);
            await request(app).post("/budget").send(testBudget2);

            const response = await request(app).get("/budget");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([
                {
                    totalBudget: 100,
                    budgetItem: [],
                    event: {
                        eventName: "Launch Party!",
                        eventDate: "2024-01-01",
                        eventDescription: "Launch party for Event Sorcerer!",
                        id: 1,
                    },
                    id: 1,
                },
                {
                    totalBudget: 200,
                    budgetItem: [],
                    event: {
                        eventName: "Class Final",
                        eventDate: "2024-12-17",
                        eventDescription: "Final exam for our class",
                        id: 2,
                    },
                    id: 2,
                },
            ]);
        });

        // PASSED
        it("should get the budget at the specified index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/budget").send(testBudget);
            await request(app).post("/budget").send(testBudget2);

            const response = await request(app).get("/budget/2");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                totalBudget: 200,
                budgetItem: [],
                event: {
                    eventName: "Class Final",
                    eventDate: "2024-12-17",
                    eventDescription: "Final exam for our class",
                    id: 2,
                },
                id: 2,
            });
        });

        // PASSED
        it("should not get a budget due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/budget").send(testBudget);
            await request(app).post("/budget").send(testBudget2);

            const response = await request(app).get("/budget/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("no budget found");
        });
    });

    describe("Updates", () => {
        // PASSED
        it("should update the specified budget's totalBudget", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);

            const response = await request(app).patch("/budget/1").send({
                totalBudget: 250,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                totalBudget: 250,
                budgetItem: [],
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
        it("should update the specified budget's related event", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/budget").send(testBudget);

            const response = await request(app).patch("/budget/1").send({
                event: 2,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                totalBudget: 100,
                budgetItem: [],
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
        it("should not update a budget due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);

            const response = await request(app).patch("/budget/10").send({
                totalBudget: 250,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this budget does not exist");
        });

        // PASSED
        it("should not update a budget due to an invalid field", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);

            const response = await request(app).patch("/budget/1").send({
                totalBdget: 250,
            });
            expect(response.statusCode).toBe(500);
            expect(response.body).toEqual({});
        });
    });

    describe("Deletion", () => {
        // PASSED
        it("should delete a budget", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);

            const response = await request(app).delete("/budget/1");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("budget has been removed");
        });

        // PASSED
        it("should not delete a budget due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);

            const response = await request(app).delete("/budget/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this budget does not exist");
        });
    });
});
