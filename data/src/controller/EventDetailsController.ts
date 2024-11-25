import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { EventDetails } from "../entity/EventDetails";

export class EventDetailsController {
    private detailsRepository = AppDataSource.getRepository(EventDetails);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.detailsRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const details = await this.detailsRepository.findOne({
            where: { id },
        });

        if (!details) {
            return "no event details found";
        }
        return details;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const {
            eventName,
            eventDate,
            eventTime,
            eventLocation,
            eventDescription,
            rsvpLink,
            rsvpDueDate,
            rsvpDueTime,
            subevents,
            participants,
        } = request.body;

        const details = Object.assign(new EventDetails(), {
            eventName,
            eventDate,
            eventTime,
            eventLocation,
            eventDescription,
            rsvpLink,
            rsvpDueDate,
            rsvpDueTime,
            subevents,
            participants,
        });

        return this.detailsRepository.save(details);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const body = request.body;

        let existingDetails = await this.detailsRepository.findOneBy({ id });

        if (!existingDetails) {
            return "these event details do not exist";
        }

        await this.detailsRepository.update(id, body);

        let newDetails = await this.detailsRepository.findOneBy({ id });

        return newDetails;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let detailsToRemove = await this.detailsRepository.findOneBy({ id });

        if (!detailsToRemove) {
            return "these event details do not exist";
        }

        await this.detailsRepository.remove(detailsToRemove);

        return "event details have been removed";
    }
}
