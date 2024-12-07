import { body, param } from "express-validator";
import { EventController } from "./controller/EventController";
import { UserController } from "./controller/UserController";
import { ItineraryController } from "./controller/ItineraryController";
import { TaskController } from "./controller/TaskController";
import { BudgetController } from "./controller/BudgetController";
import { AttendeeController } from "./controller/AttendeeController";

export const Routes = [
    // Event routes ("/event")
    {
        method: "get",
        route: "/event",
        controller: EventController,
        action: "all",
        validation: [],
    },
    {
        method: "get",
        route: "/event/:id",
        controller: EventController,
        action: "one",
        validation: [param("id").isInt()],
    },
    {
        method: "post",
        route: "/event",
        controller: EventController,
        action: "save",
        validation: [
            body("eventName").isString(),
            body("eventDate").isDate({ format: "YYYY-MM-DD" }),
            body("eventDescription").isString(),
        ],
    },
    {
        method: "patch",
        route: "/event/:id",
        controller: EventController,
        action: "update",
        validation: [param("id").isInt()],
    },
    {
        method: "delete",
        route: "/event/:id",
        controller: EventController,
        action: "remove",
        validation: [param("id").isInt()],
    },
    // Task routes ("/tasks")
    {
        method: "get",
        route: "/tasks",
        controller: TaskController,
        action: "all",
        validation: [],
    },
    {
        method: "get",
        route: "/tasks/:id",
        controller: TaskController,
        action: "one",
        validation: [param("id").isInt()],
    },
    {
        method: "post",
        route: "/tasks",
        controller: TaskController,
        action: "save",
        validation: [
            body("taskName").isString(),
            body("date").isDate({ format: "YYYY-MM-DD" }),
            body("event").isInt(),
            body("assignedTo").isString(),
        ],
    },
    {
        method: "patch",
        route: "/tasks/:id",
        controller: TaskController,
        action: "update",
        validation: [param("id").isInt()],
    },
    {
        method: "delete",
        route: "/tasks/:id",
        controller: TaskController,
        action: "remove",
        validation: [param("id").isInt()],
    },
    // Budget routes ("/budget")
    // WORK IN PROGRESS
    {
        method: "get",
        route: "/budget",
        controller: BudgetController,
        action: "all",
        validation: [],
    },
    {
        method: "get",
        route: "/budget/:id",
        controller: BudgetController,
        action: "one",
        validation: [param("id").isInt()],
    },
    {
        method: "post",
        route: "/budget",
        controller: BudgetController,
        action: "save",
        validation: [body("totalBudget").isNumeric(), body("event").isInt()],
    },
    {
        method: "patch",
        route: "/budget/:id",
        controller: BudgetController,
        action: "update",
        validation: [param("id").isInt()],
    },
    {
        method: "delete",
        route: "/budget/:id",
        controller: BudgetController,
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
            body("subeventTime").isTime({ mode: "withSeconds" }),
            body("subeventDescription").isString(),
            body("event").isInt(),
        ],
    },
    {
        method: "patch",
        route: "/itinerary/:id",
        controller: ItineraryController,
        action: "update",
        validation: [param("id").isInt()],
    },
    {
        method: "delete",
        route: "/itinerary/:id",
        controller: ItineraryController,
        action: "remove",
        validation: [param("id").isInt()],
    },
    // Attendee routes ("/attendees")
    {
        method: "get",
        route: "/attendees",
        controller: AttendeeController,
        action: "all",
        validation: [],
    },
    {
        method: "get",
        route: "/attendees/:id",
        controller: AttendeeController,
        action: "one",
        validation: [param("id").isInt()],
    },
    {
        method: "post",
        route: "/attendees",
        controller: AttendeeController,
        action: "save",
        validation: [
            body("firstName").isString(),
            body("lastName").isString(),
            body("username").isString(),
            body("event").isInt(),
        ],
    },
    {
        method: "patch",
        route: "/attendees/:id",
        controller: AttendeeController,
        action: "update",
        validation: [param("id").isInt()],
    },
    {
        method: "delete",
        route: "/attendees/:id",
        controller: AttendeeController,
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
        method: "patch",
        route: "/user/:id",
        controller: UserController,
        action: "update",
        validation: [param("id").isInt()],
    },
    {
        method: "delete",
        route: "/user/:id",
        controller: UserController,
        action: "remove",
        validation: [param("id").isInt()],
    },
];
