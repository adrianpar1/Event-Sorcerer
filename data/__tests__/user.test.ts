import app from "../src/app";
import { port } from "../src/config";
import { AppDataSource } from "../src/data-source";
import * as request from "supertest";

let connection, server;

const testUser = {
    username: "test1234",
    password: "pleaseihopethisworks",
    hashedPassword: "gewhu239kjl23gy8",
    email: "test@gmail.com",
    role: "QA Tester",
    company: "RB's Lovers",
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

describe("User Tests", () => {
    describe("Initialization", () => {
        // PASSED
        it("should connect", async () => {
            const response = await request(app).get("/user");
            expect(response.statusCode).toBe(200);
        });

        // PASSED
        it("should be no users initially", async () => {
            const response = await request(app).get("/user");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("Creation", () => {
        // PASSED
        it("should create a user", async () => {
            const response = await request(app).post("/user").send(testUser);
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({ ...testUser, id: 1 });
        });

        // PASSED
        it("should not create a user if no username is given", async () => {
            const response = await request(app).post("/user").send({
                password: "pleaseihopethisworks",
                hashedPassword: "gewhu239kjl23gy8",
                email: "test@gmail.com",
                role: "QA Tester",
                company: "RB's Lovers",
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
        it("should not create a user if no password is given", async () => {
            const response = await request(app).post("/user").send({
                username: "test1234",
                hashedPassword: "gewhu239kjl23gy8",
                email: "test@gmail.com",
                role: "QA Tester",
                company: "RB's Lovers",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "password",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a user if no hashedPassword exists", async () => {
            const response = await request(app).post("/user").send({
                username: "test1234",
                password: "pleaseihopethisworks",
                email: "test@gmail.com",
                role: "QA Tester",
                company: "RB's Lovers",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "hashedPassword",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a user if no email is given", async () => {
            const response = await request(app).post("/user").send({
                username: "test1234",
                password: "pleaseihopethisworks",
                hashedPassword: "gewhu239kjl23gy8",
                role: "QA Tester",
                company: "RB's Lovers",
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
        it("should not create a user if no role is given", async () => {
            const response = await request(app).post("/user").send({
                username: "test1234",
                password: "pleaseihopethisworks",
                hashedPassword: "gewhu239kjl23gy8",
                email: "test@gmail.com",
                company: "RB's Lovers",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "role",
                location: "body",
                type: "field",
            });
        });

        // PASSED
        it("should not create a user if no company is given", async () => {
            const response = await request(app).post("/user").send({
                username: "test1234",
                password: "pleaseihopethisworks",
                hashedPassword: "gewhu239kjl23gy8",
                email: "test@gmail.com",
                role: "QA Tester",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).not.toBeNull();
            expect(response.body.errors.length).toBe(1);
            expect(response.body.errors[0]).toEqual({
                msg: "Invalid value",
                path: "company",
                location: "body",
                type: "field",
            });
        });
    });

    describe("Updates", () => {
        //
        it("should update the specified user's username", async () => {
            await request(app).post("/user").send(testUser);

            const response = await request(app).patch("/user/1").send({
                username: "update5678",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                username: "update5678",
                hashedPassword: "gewhu239kjl23gy8",
                email: "test@gmail.com",
                role: "QA Tester",
                company: "RB's Lovers",
                id: 1,
            });
        });

        //
        it("should update the specified user's password", async () => {
            await request(app).post("/user").send(testUser);

            const response = await request(app).patch("/user/1").send({
                password: "thisisworkingnow",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                username: "test1234",
                hashedPassword: "gewhu239kjl23gy8",
                email: "test@gmail.com",
                role: "QA Tester",
                company: "RB's Lovers",
                id: 1,
            });
        });

        //
        it("should update the specified user's hashedPassword", async () => {
            await request(app).post("/user").send(testUser);

            const response = await request(app).patch("/user/1").send({
                hashedPassword: "safhiufh2hfdjakl842asd1",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                username: "test1234",
                hashedPassword: "safhiufh2hfdjakl842asd1",
                email: "test@gmail.com",
                role: "QA Tester",
                company: "RB's Lovers",
                id: 1,
            });
        });

        //
        it("should update the specified user's email", async () => {
            await request(app).post("/user").send(testUser);

            const response = await request(app).patch("/user/1").send({
                email: "success@gmail.com",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                username: "test1234",
                hashedPassword: "gewhu239kjl23gy8",
                email: "success@gmail.com",
                role: "QA Tester",
                company: "RB's Lovers",
                id: 1,
            });
        });

        //
        it("should update the specified user's role", async () => {
            await request(app).post("/user").send(testUser);

            const response = await request(app).patch("/user/1").send({
                role: "Software Developer",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                username: "test1234",
                hashedPassword: "gewhu239kjl23gy8",
                email: "test@gmail.com",
                role: "Software Developer",
                company: "RB's Lovers",
                id: 1,
            });
        });

        //
        it("should update the specified user's company", async () => {
            await request(app).post("/user").send(testUser);

            const response = await request(app).patch("/user/1").send({
                company: "Kaliski's Kings",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                username: "test1234",
                hashedPassword: "gewhu239kjl23gy8",
                email: "test@gmail.com",
                role: "QA Tester",
                company: "Kaliski's Kings",
                id: 1,
            });
        });

        //
        it("should not update a user due to an invalid index", async () => {
            await request(app).post("/user").send(testUser);

            const response = await request(app).patch("/user/10").send({
                username: "update5678",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this user does not exist");
        });
    });

    describe("Deletion", () => {
        // PASSED
        it("should delete a user", async () => {
            await request(app).post("/user").send(testUser);

            const response = await request(app).delete("/user/1");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("user has been removed");
        });

        // PASSED
        it("should not delete a user due to an invalid index", async () => {
            await request(app).post("/user").send(testUser);

            const response = await request(app).delete("/user/10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual("this user does not exist");
        });
    });
});
