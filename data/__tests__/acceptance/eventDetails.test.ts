import app from "../../src/app";
import { port } from "../../src/config";
import { AppDataSource } from "../../src/data-source";
import * as request from "supertest";

let connection, server;

const testEvent = {
   eventName: "Launch Party!",
   eventDate: "2024-01-01",
   eventTime: "21:21:59",
   eventLocation: "Duncan Hall 318",
   eventDescription: "Launch party for Event Sorcerer!",
   rsvpLink: "https://fakenews.com",
   rsvpDueDate: "2024-01-03",
   rsvpDueTime: "23:59:59",
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
   const response = await request(app).get("/users");
   expect(response.statusCode).toBe(200);
   expect(response.body).toEqual([]);
});

it("should create a user", async () => {
   const response = await request(app).post("/users").send(testUser);
   expect(response.statusCode).toBe(200);
   expect(response.body).toEqual({ ...testUser, id: 1 });
});

it("should not create a user if no firstName is given", async () => {
   const response = await request(app)
      .post("/users")
      .send({ lastName: "Doe", age: 21 });
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

it("should not create a user if age is less than 0", async () => {
   const response = await request(app)
      .post("/users")
      .send({ firstName: "John", lastName: "Doe", age: -1 });
   expect(response.statusCode).toBe(400);
   expect(response.body.errors).not.toBeNull();
   expect(response.body.errors.length).toBe(1);
   expect(response.body.errors[0]).toEqual({
      msg: "age must be a positive integer",
      path: "age",
      value: -1,
      location: "body",
      type: "field",
   });
});
