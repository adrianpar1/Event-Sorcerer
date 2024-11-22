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
   subeventOrder: 1
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

   // PASSED
   it("should create a subevent", async () => {
      const response = await request(app).post("/itinerary").send(testSubevent);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({ ...testSubevent });
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
