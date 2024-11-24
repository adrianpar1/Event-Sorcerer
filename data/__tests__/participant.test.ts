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
        });

        describe("Updates", () => {
            // PASSED
            it("should update the specified participant's firstName", async () => {
                await request(app).post("/participant").send(testParticipant);

                const response = await request(app)
                    .patch("/participant/1")
                    .send({
                        firstName: "Adam",
                    });
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual({
                    firstName: "Adam",
                    lastName: "Oochie",
                    email: "testemail@gmail.com",
                    phone: "123-456-7890",
                    username: "test123",
                    admin: true,
                    eventId: 3,
                    id: 1,
                });
            });

            // PASSED
            it("should update the specified participant's lastName", async () => {
                await request(app).post("/participant").send(testParticipant);

                const response = await request(app)
                    .patch("/participant/1")
                    .send({
                        lastName: "Apple",
                    });
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual({
                    firstName: "Mike",
                    lastName: "Apple",
                    email: "testemail@gmail.com",
                    phone: "123-456-7890",
                    username: "test123",
                    admin: true,
                    eventId: 3,
                    id: 1,
                });
            });

            // PASSED
            it("should update the specified participant's email", async () => {
                await request(app).post("/participant").send(testParticipant);

                const response = await request(app)
                    .patch("/participant/1")
                    .send({
                        email: "goodjob@gmail.com",
                    });
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual({
                    firstName: "Mike",
                    lastName: "Oochie",
                    email: "goodjob@gmail.com",
                    phone: "123-456-7890",
                    username: "test123",
                    admin: true,
                    eventId: 3,
                    id: 1,
                });
            });

            // PASSED
            it("should update the specified participant's phone number", async () => {
                await request(app).post("/participant").send(testParticipant);

                const response = await request(app)
                    .patch("/participant/1")
                    .send({
                        phone: "987-654-3210",
                    });
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual({
                    firstName: "Mike",
                    lastName: "Oochie",
                    email: "testemail@gmail.com",
                    phone: "987-654-3210",
                    username: "test123",
                    admin: true,
                    eventId: 3,
                    id: 1,
                });
            });

            // PASSED
            it("should update the specified participant's username", async () => {
                await request(app).post("/participant").send(testParticipant);

                const response = await request(app)
                    .patch("/participant/1")
                    .send({
                        username: "newUser5",
                    });
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual({
                    firstName: "Mike",
                    lastName: "Oochie",
                    email: "testemail@gmail.com",
                    phone: "123-456-7890",
                    username: "newUser5",
                    admin: true,
                    eventId: 3,
                    id: 1,
                });
            });

            // PASSED
            it("should update the specified participant's admin status", async () => {
                await request(app).post("/participant").send(testParticipant);

                const response = await request(app)
                    .patch("/participant/1")
                    .send({
                        admin: false,
                    });
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual({
                    firstName: "Mike",
                    lastName: "Oochie",
                    email: "testemail@gmail.com",
                    phone: "123-456-7890",
                    username: "test123",
                    admin: false,
                    eventId: 3,
                    id: 1,
                });
            });

            // PASSED
            it("should update the specified participant's eventId", async () => {
                await request(app).post("/participant").send(testParticipant);

                const response = await request(app)
                    .patch("/participant/1")
                    .send({
                        eventId: 2,
                    });
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual({
                    firstName: "Mike",
                    lastName: "Oochie",
                    email: "testemail@gmail.com",
                    phone: "123-456-7890",
                    username: "test123",
                    admin: true,
                    eventId: 2,
                    id: 1,
                });
            });

            // PASSED
            it("should not update a participant due to an invalid index", async () => {
                await request(app).post("/participant").send(testParticipant);

                const response = await request(app)
                    .patch("/participant/10")
                    .send({
                        subeventName: "Not going to class",
                    });
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(
                    "this participant does not exist"
                );
            });
        });

        describe("Deletion", () => {
            // PASSED
            it("should delete a participant", async () => {
                await request(app).post("/participant").send(testParticipant);

                const response = await request(app).delete("/participant/1");
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual("participant has been removed");
            });

            // PASSED
            it("should not delete a participant due to an invalid index", async () => {
                await request(app).post("/participant").send(testParticipant);

                const response = await request(app).delete("/participant/10");
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(
                    "this participant does not exist"
                );
            });
        });
    });
});
