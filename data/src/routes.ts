import { body, param } from "express-validator";
import { EventDetailsController } from "./controller/EventDetailsController";
import { UserController } from "./controller/UserController";
import { ParticipantController } from "./controller/ParticipantController";

export const Routes = [
   // EventDetails routes ("/details")
   {
      method: "get",
      route: "/details",
      controller: EventDetailsController,
      action: "all",
      validation: [],
   },
   {
      method: "get",
      route: "/details/:id",
      controller: EventDetailsController,
      action: "one",
      validation: [param("id").isInt()],
   },
   {
      method: "post",
      route: "/details",
      controller: EventDetailsController,
      action: "save",
      validation: [
         body("eventName").isString(),
         body("eventDate").isDate({ format: "YYYY-MM-DD" }),
         body("eventTime").isTime({ mode: "withSeconds" }),
         body("eventLocation").isString(),
         body("eventDescription").isString(),
         body("rsvpLink").isString(),
         body("rsvpDueDate").isDate({ format: "YYYY-MM-DD" }),
         body("rsvpDueTime").isTime({ mode: "withSeconds" }),
      ],
   },
   {
      method: "delete",
      route: "/details/:id",
      controller: EventDetailsController,
      action: "remove",
      validation: [param("id").isInt()],
   },
   // Participant routes ("/participants")
   {
      method: "get",
      route: "/participants",
      controller: ParticipantController,
      action: "all",
      validation: [],
   },
   {
      method: "get",
      route: "/participants/:id",
      controller: ParticipantController,
      action: "one",
      validation: [param("id").isInt()],
   },
   {
      method: "post",
      route: "/participants",
      controller: ParticipantController,
      action: "save",
      validation: [
         body("firstName").isString(),
         body("lastName").isString(),
         body("email").isString(),
         body("phone").isString(),
         body("username").isString(),
         body("admin").isBoolean(),
      ],
   },
   {
      method: "delete",
      route: "/participants/:id",
      controller: ParticipantController,
      action: "remove",
      validation: [param("id").isInt()],
   },
   // Itinerary routes ("/itinerary") - WIP
   {
      method: "get",
      route: "/participants",
      controller: ParticipantController,
      action: "all",
      validation: [],
   },
   {
      method: "get",
      route: "/participants/:id",
      controller: ParticipantController,
      action: "one",
      validation: [param("id").isInt()],
   },
   {
      method: "post",
      route: "/participants",
      controller: ParticipantController,
      action: "save",
      validation: [
        body("firstName").isString(),
        body("lastName").isString(),
        body("email").isString(),
        body("phone").isString(),
        body("username").isString(),
        body("admin").isBoolean(),
      ],
   },
   {
      method: "delete",
      route: "/participants/:id",
      controller: ParticipantController,
      action: "remove",
      validation: [param("id").isInt()],
   },
   // User routes ("/users")
   {
      method: "get",
      route: "/users",
      controller: UserController,
      action: "all",
      validation: [],
   },
   {
      method: "get",
      route: "/users/:id",
      controller: UserController,
      action: "one",
      validation: [param("id").isInt()],
   },
   {
      method: "post",
      route: "/users",
      controller: UserController,
      action: "save",
      validation: [
         body("username").isString(),
         body("password").isString(),
         body("hashedPasssword").isString(),
         body("email").isString(),
         body("role").isString(),
         body("company").isString(),
      ],
   },
   {
      method: "delete",
      route: "/users/:id",
      controller: UserController,
      action: "remove",
      validation: [param("id").isInt()],
   },
];
