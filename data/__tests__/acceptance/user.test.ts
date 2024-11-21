import app from "../../src/app";
import { port } from "../../src/config";
import { AppDataSource } from "../../src/data-source";
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

it("should be no users initially", async () => {
    const response = await request(app).get("/user");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
});

it("should create a user", async () => {
    const response = await request(app).post("/user").send(testUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ...testUser, id: 1 });
});

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
