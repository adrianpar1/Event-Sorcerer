import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Event } from "../entity/Event";

export class EventController {
    private eventRepository = AppDataSource.getRepository(Event);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.eventRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const event = await this.eventRepository.findOne({
            where: { id },
        });

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

        let existingEvent = await this.eventRepository.findOneBy({ id });

        if (!existingEvent) {
            return "this event does not exist";
        }

        await this.eventRepository.update(id, body);

        let newEvent = await this.eventRepository.findOneBy({ id });

        return newEvent;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let eventToRemove = await this.eventRepository.findOneBy({ id });

        if (!eventToRemove) {
            return "this event does not exist";
        }

        await this.eventRepository.remove(eventToRemove);

        return "event has been removed";
    }
}
