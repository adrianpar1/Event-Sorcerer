import app from "../src/app";
import { port } from "../src/config";
import { AppDataSource } from "../src/data-source";
import * as request from "supertest";
import { BudgetItem } from "../src/entity/BudgetItem";
import exp = require("constants");

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

const testBudgetItem = {
    expenseAmount: 50,
    expenseDescription: "food",
    budget: 1,
};

const testBudgetItem2 = {
    expenseAmount: 25,
    expenseDescription: "drinks",
    budget: 1,
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

describe("BudgetItem Tests", () => {
    describe("Initialization", () => {
        // PASSED
        it("should connect", async () => {
            const response1 = await request(app).get("/event");
            const response2 = await request(app).get("/item");
            expect(response1.statusCode).toBe(200);
            expect(response2.statusCode).toBe(200);
        });

        // PASSED
        it("should be no budget items initially", async () => {
            const response = await request(app).get("/item");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("Creation", () => {
        // PASSED
        it("should create a budget item", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);
            const response = await request(app)
                .post("/item")
                .send(testBudgetItem);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                ...testBudgetItem,
                id: 1,
            });
        });

        // PASSED
        it("should not create a budget item if no expenseAmount is given", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);
            const response = await request(app).post("/item").send({
                expenseDescription: "food",
                budget: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "expenseAmount",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a budget item if no expenseDescription is given", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);
            const response = await request(app).post("/item").send({
                expenseAmount: 50,
                budget: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "expenseDescription",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a budget item if no related budget is given", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);
            const response = await request(app).post("/item").send({
                expenseAmount: 50,
                expenseDescription: "food",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "budget",
                location: "body",
                type: "field",
            });
        });
    });

    describe("Retrieval", () => {
        // PASSED
        it("should get all budget items", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/budget").send(testBudget);
            await request(app).post("/budget").send(testBudget2);
            await request(app).post("/item").send(testBudgetItem);
            await request(app).post("/item").send(testBudgetItem2);

            const response = await request(app).get("/item");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([
                {
                    ...testBudgetItem,
                    budget: {
                        totalBudget: 100,
                        id: 1,
                    },
                    id: 1,
                },
                {
                    ...testBudgetItem2,
                    budget: {
                        totalBudget: 100,
                        id: 1,
                    },
                    id: 2,
                },
            ]);
        });

        // PASSED
        it("should get the budget item at the specified index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/budget").send(testBudget);
            await request(app).post("/budget").send(testBudget2);
            await request(app).post("/item").send(testBudgetItem);
            await request(app).post("/item").send(testBudgetItem2);

            const response = await request(app).get("/item/2");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                ...testBudgetItem2,
                budget: {
                    totalBudget: 100,
                    id: 1,
                },
                id: 2,
            });
        });

        // PASSED
        it("should not get a budget item due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/budget").send(testBudget);
            await request(app).post("/budget").send(testBudget2);
            await request(app).post("/item").send(testBudgetItem);
            await request(app).post("/item").send(testBudgetItem2);

            const response = await request(app).get("/item/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("no budget item found");
        });
    });

    describe("Updates", () => {
        // PASSED
        it("should update the specified budget item's expenseAmount", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);
            await request(app).post("/item").send(testBudgetItem);

            const response = await request(app).patch("/item/1").send({
                expenseAmount: 75,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                expenseAmount: 75,
                expenseDescription: "food",
                budget: {
                    totalBudget: 100,
                    id: 1,
                },
                id: 1,
            });
        });

        // PASSED
        it("should update the specified budget item's expenseDescription", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);
            await request(app).post("/item").send(testBudgetItem);

            const response = await request(app).patch("/item/1").send({
                expenseDescription: "pizza",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                expenseAmount: 50,
                expenseDescription: "pizza",
                budget: {
                    totalBudget: 100,
                    id: 1,
                },
                id: 1,
            });
        });

        // PASSED
        it("should update the specified budget item's related event", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/event").send(testEvent2);
            await request(app).post("/budget").send(testBudget);
            await request(app).post("/budget").send(testBudget2);
            await request(app).post("/item").send(testBudgetItem);

            const response = await request(app).patch("/item/1").send({
                budget: 2,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                expenseAmount: 50,
                expenseDescription: "food",
                budget: {
                    totalBudget: 200,
                    id: 2,
                },
                id: 1,
            });
        });

        // PASSED
        it("should not update a budget item due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);
            await request(app).post("/item").send(testBudgetItem);

            const response = await request(app).patch("/item/10").send({
                expenseAmount: 75,
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this budget item does not exist");
        });

        // PASSED
        it("should not update a budget item due to an invalid field", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);
            await request(app).post("/item").send(testBudgetItem);

            const response = await request(app).patch("/item/1").send({
                expenseAmunt: 75,
            });
            expect(response.statusCode).toBe(500);
            expect(response.body).toEqual({});
        });
    });

    describe("Deletion", () => {
        // PASSED
        it("should delete a budget item", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);
            await request(app).post("/item").send(testBudgetItem);

            const response = await request(app).delete("/item/1");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("budget item has been removed");
        });

        // PASSED
        it("should not delete a budget item due to an invalid index", async () => {
            await request(app).post("/event").send(testEvent);
            await request(app).post("/budget").send(testBudget);
            await request(app).post("/item").send(testBudgetItem);

            const response = await request(app).delete("/item/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this budget item does not exist");
        });
    });
});
