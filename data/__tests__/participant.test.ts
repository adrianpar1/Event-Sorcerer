import app from "../src/app";
import { port } from "../src/config";
import { AppDataSource } from "../src/data-source";
import * as request from "supertest";

let connection, server;

const testParticipant = {
    firstName: "Mike",
    lastName: "Oochie",
    email: "testemail@gmail.com",
    phone: "123-456-7890",
    username: "test123",
    admin: true,
    eventId: 3,
    firstName: "Mike",
    lastName: "Oochie",
    email: "testemail@gmail.com",
    phone: "123-456-7890",
    username: "test123",
    admin: true,
    eventId: 3,
};

beforeEach(async () => {
    connection = await AppDataSource.initialize();
    await connection.synchronize(true);
    server = app.listen(port);
    connection = await AppDataSource.initialize();
    await connection.synchronize(true);
    server = app.listen(port);
});

afterEach(() => {
    connection.close();
    server.close();
    connection.close();
    server.close();
});

describe("Participant Tests", () => {
    describe("Initialization", () => {
        // PASSED
        it("should connect", async () => {
            const response = await request(app).get("/participant");
            expect(response.statusCode).toBe(200);
        });
    describe("Initialization", () => {
        // PASSED
        it("should connect", async () => {
            const response = await request(app).get("/participant");
            expect(response.statusCode).toBe(200);
        });

        // PASSED
        it("should be no participants initially", async () => {
            const response = await request(app).get("/participant");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
        // PASSED
        it("should be no participants initially", async () => {
            const response = await request(app).get("/participant");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("Creation", () => {
        // PASSED
        it("should create a participant", async () => {
            const response = await request(app)
                .post("/participant")
                .send(testParticipant);
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({ ...testParticipant });
        });
    describe("Creation", () => {
        // PASSED
        it("should create a participant", async () => {
            const response = await request(app)
                .post("/participant")
                .send(testParticipant);
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({ ...testParticipant });
        });

        // PASSED
        it("should not create a participant if no firstName is given", async () => {
            const response = await request(app).post("/participant").send({
                lastName: "Oochie",
                email: "testemail@gmail.com",
                phone: "123-456-7890",
                username: "test123",
                admin: true,
                eventId: 3,
                id: 1,
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
        it("should not create a participant if no firstName is given", async () => {
            const response = await request(app).post("/participant").send({
                lastName: "Oochie",
                email: "testemail@gmail.com",
                phone: "123-456-7890",
                username: "test123",
                admin: true,
                eventId: 3,
                id: 1,
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
        it("should not create a participant if no lastName is given", async () => {
            const response = await request(app).post("/participant").send({
                firstName: "Mike",
                email: "testemail@gmail.com",
                phone: "123-456-7890",
                username: "test123",
                admin: true,
                eventId: 3,
                id: 1,
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
        it("should not create a participant if no lastName is given", async () => {
            const response = await request(app).post("/participant").send({
                firstName: "Mike",
                email: "testemail@gmail.com",
                phone: "123-456-7890",
                username: "test123",
                admin: true,
                eventId: 3,
                id: 1,
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
        it("should not create a participant if no email is given", async () => {
            const response = await request(app).post("/participant").send({
                firstName: "Mike",
                lastName: "Oochie",
                phone: "123-456-7890",
                username: "test123",
                admin: true,
                eventId: 3,
                id: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "email",
                location: "body",
                type: "field",
            });
        });
        // PASSED
        it("should not create a participant if no email is given", async () => {
            const response = await request(app).post("/participant").send({
                firstName: "Mike",
                lastName: "Oochie",
                phone: "123-456-7890",
                username: "test123",
                admin: true,
                eventId: 3,
                id: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "email",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a participant if no phone is given", async () => {
            const response = await request(app).post("/participant").send({
                firstName: "Mike",
                lastName: "Oochie",
                email: "testemail@gmail.com",
                username: "test123",
                admin: true,
                eventId: 3,
                id: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "phone",
                location: "body",
                type: "field",
            });
        });
        // PASSED
        it("should not create a participant if no phone is given", async () => {
            const response = await request(app).post("/participant").send({
                firstName: "Mike",
                lastName: "Oochie",
                email: "testemail@gmail.com",
                username: "test123",
                admin: true,
                eventId: 3,
                id: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "phone",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a participant if no username is given", async () => {
            const response = await request(app).post("/participant").send({
                firstName: "Mike",
                lastName: "Oochie",
                email: "testemail@gmail.com",
                phone: "123-456-7890",
                admin: true,
                eventId: 3,
                id: 1,
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
        it("should not create a participant if no username is given", async () => {
            const response = await request(app).post("/participant").send({
                firstName: "Mike",
                lastName: "Oochie",
                email: "testemail@gmail.com",
                phone: "123-456-7890",
                admin: true,
                eventId: 3,
                id: 1,
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
        it("should not create a participant if no admin status is given", async () => {
            const response = await request(app).post("/participant").send({
                firstName: "Mike",
                lastName: "Oochie",
                email: "testemail@gmail.com",
                phone: "123-456-7890",
                username: "test123",
                eventId: 3,
                id: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "admin",
                location: "body",
                type: "field",
            });
        });
        // PASSED
        it("should not create a participant if no admin status is given", async () => {
            const response = await request(app).post("/participant").send({
                firstName: "Mike",
                lastName: "Oochie",
                email: "testemail@gmail.com",
                phone: "123-456-7890",
                username: "test123",
                eventId: 3,
                id: 1,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "admin",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a participant if no eventId is given", async () => {
            const response = await request(app).post("/participant").send({
                firstName: "Mike",
                lastName: "Oochie",
                email: "testemail@gmail.com",
                phone: "123-456-7890",
                username: "test123",
                admin: true,
                id: 1,
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
    });

    describe("Deletion", () => {
        // PASSED
        it("should delete a participant", async () => {
            await request(app).post("/participant").send({
                firstName: "Mike",
                lastName: "Oochie",
                email: "testemail@gmail.com",
                phone: "123-456-7890",
                username: "test123",
                admin: true,
                eventId: 3,
            });

            const response = await request(app).delete("/participant/1");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("participant has been removed");
        });

        // PASSED
        it("should not delete a participant due to an invalid index", async () => {
            await request(app).post("/participant").send({
                firstName: "Mike",
                lastName: "Oochie",
                email: "testemail@gmail.com",
                phone: "123-456-7890",
                username: "test123",
                admin: true,
                eventId: 3,
            });

            const response = await request(app).delete("/participant/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this participant does not exist");
        });
    });
});
