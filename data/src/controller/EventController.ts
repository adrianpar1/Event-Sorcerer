import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Event } from "../entity/Event";

export class EventController {
    private eventRepository = AppDataSource.getRepository(Event);

    async all(request: Request, response: Response, next: NextFunction) {
        const events = await this.eventRepository
            .createQueryBuilder("event")
            .leftJoinAndSelect("event.tasks", "task")
            .leftJoinAndSelect("event.budget", "budget")
            .leftJoinAndSelect("event.itinerary", "itinerary")
            .leftJoinAndSelect("event.attendees", "attendees")
            .getMany();

        return events;
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const event = await this.eventRepository
            .createQueryBuilder("event")
            .leftJoinAndSelect("event.tasks", "task")
            .leftJoinAndSelect("event.budget", "budget")
            .leftJoinAndSelect("event.itinerary", "itinerary")
            .leftJoinAndSelect("event.attendees", "attendees")
            .where({ id })
            .getOne();

        if (!event) {
            return "no event details found";
        }

        return event;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { eventName, eventDate, eventDescription } = request.body;

        const event = Object.assign(new Event(), {
            eventName,
            eventDate,
            eventDescription,
        });

        return this.eventRepository.save(event);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const body = request.body;

        let existingEvent = await this.eventRepository
            .createQueryBuilder("event")
            .leftJoinAndSelect("event.tasks", "task")
            .leftJoinAndSelect("event.budget", "budget")
            .leftJoinAndSelect("event.itinerary", "itinerary")
            .leftJoinAndSelect("event.attendees", "attendees")
            .where({ id })
            .getOne();

        if (!existingEvent) {
            return "this event does not exist";
        }

        await this.eventRepository.update(id, body);

        let newEvent = await this.eventRepository
            .createQueryBuilder("event")
            .leftJoinAndSelect("event.tasks", "task")
            .leftJoinAndSelect("event.budget", "budget")
            .leftJoinAndSelect("event.itinerary", "itinerary")
            .leftJoinAndSelect("event.attendees", "attendees")
            .where({ id })
            .getOne();

        return newEvent;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let eventToRemove = await this.eventRepository
            .createQueryBuilder("event")
            .leftJoinAndSelect("event.tasks", "task")
            .leftJoinAndSelect("event.budget", "budget")
            .leftJoinAndSelect("event.itinerary", "itinerary")
            .leftJoinAndSelect("event.attendees", "attendees")
            .where({ id })
            .getOne();

        if (!eventToRemove) {
            return "this event does not exist";
        }

        await this.eventRepository.remove(eventToRemove);

        return "event has been removed";
    }
}
