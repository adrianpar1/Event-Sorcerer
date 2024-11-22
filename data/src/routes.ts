import { body, param } from "express-validator";
import { EventDetailsController } from "./controller/EventDetailsController";
import { UserController } from "./controller/UserController";
import { ParticipantController } from "./controller/ParticipantController";
import { ItineraryController } from "./controller/ItineraryController";

export const Routes = [
    // EventDetails routes ("/event")
    {
        method: "get",
        route: "/event",
        controller: EventDetailsController,
        action: "all",
        validation: [],
    },
    {
        method: "get",
        route: "/event/:id",
        controller: EventDetailsController,
        action: "one",
        validation: [param("id").isInt()],
    },
    {
        method: "post",
        route: "/event",
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
        route: "/event/:id",
        controller: EventDetailsController,
        action: "remove",
        validation: [param("id").isInt()],
    },
    // Participant routes ("/participants")
    {
        method: "get",
        route: "/participant",
        controller: ParticipantController,
        action: "all",
        validation: [],
    },
    {
        method: "get",
        route: "/participant/:id",
        controller: ParticipantController,
        action: "one",
        validation: [param("id").isInt()],
    },
    {
        method: "post",
        route: "/participant",
        controller: ParticipantController,
        action: "save",
        validation: [
            body("firstName").isString(),
            body("lastName").isString(),
            body("email").isString(),
            body("phone").isString(),
            body("username").isString(),
            body("admin").isBoolean(),
            body("eventId").isInt(),
        ],
    },
    {
        method: "delete",
        route: "/participant/:id",
        controller: ParticipantController,
        action: "remove",
        validation: [param("id").isInt()],
    },
    // Itinerary routes ("/itinerary")
    {
        method: "get",
        route: "/itinerary",
        controller: ItineraryController,
        action: "all",
        validation: [],
    },
    {
        method: "get",
        route: "/itinerary/:id",
        controller: ItineraryController,
        action: "one",
        validation: [param("id").isInt()],
    },
    {
        method: "post",
        route: "/itinerary",
        controller: ItineraryController,
        action: "save",
        validation: [
            body("subeventName").isString(),
            body("subeventDate").isDate({ format: "YYYY-MM-DD" }),
            body("subeventTime").isTime({ mode: "withSeconds" }),
            body("subeventPoc").isString(),
            body("subeventDescription").isString(),
            body("eventId").isInt(),
            body("subeventOrder").isInt(),
        ],
    },
    {
        method: "delete",
        route: "/itinerary/:id",
        controller: ItineraryController,
        action: "remove",
        validation: [param("id").isInt()],
    },
    // User routes ("/user")
    {
        method: "get",
        route: "/user",
        controller: UserController,
        action: "all",
        validation: [],
    },
    {
        method: "get",
        route: "/user/:id",
        controller: UserController,
        action: "one",
        validation: [param("id").isInt()],
    },
    {
        method: "post",
        route: "/user",
        controller: UserController,
        action: "save",
        validation: [
            body("username").isString(),
            body("password").isString(),
            body("hashedPassword").isString(),
            body("email").isString(),
            body("role").isString(),
            body("company").isString(),
        ],
    },
    {
        method: "delete",
        route: "/user/:id",
        controller: UserController,
        action: "remove",
        validation: [param("id").isInt()],
    },
];
