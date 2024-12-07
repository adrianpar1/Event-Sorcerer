import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Itinerary } from "../entity/Itinerary";

export class ItineraryController {
    private itineraryRepository = AppDataSource.getRepository(Itinerary);

    async all(request: Request, response: Response, next: NextFunction) {
        const subevents = await this.itineraryRepository
            .createQueryBuilder("itinerary")
            .leftJoinAndSelect("itinerary.event", "event")
            .getMany();

        return subevents;
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const subevent = await this.itineraryRepository
            .createQueryBuilder("itinerary")
            .leftJoinAndSelect("itinerary.event", "event")
            .where({ id })
            .getOne();

        if (!subevent) {
            return "no subevent details found";
        }

        return subevent;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { subeventTime, subeventDescription, event } = request.body;

        const itinerary = Object.assign(new Itinerary(), {
            subeventTime,
            subeventDescription,
            event,
        });

        return this.itineraryRepository.save(itinerary);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        let id = parseInt(request.params.id);
        const body = request.body;

        const existingSubevent = await this.itineraryRepository
            .createQueryBuilder("itinerary")
            .leftJoinAndSelect("itinerary.event", "event")
            .where({ id })
            .getOne();

        if (!existingSubevent) {
            return "this subevent does not exist";
        }

        await this.itineraryRepository.update(id, body);
        id = parseInt(request.params.id);

        const newSubevent = await this.itineraryRepository
            .createQueryBuilder("itinerary")
            .leftJoinAndSelect("itinerary.event", "event")
            .where({ id })
            .getOne();

        return newSubevent;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const subeventToRemove = await this.itineraryRepository
            .createQueryBuilder("itinerary")
            .leftJoinAndSelect("itinerary.event", "event")
            .where({ id })
            .getOne();

        if (!subeventToRemove) {
            return "this subevent does not exist";
        }

        await this.itineraryRepository.remove(subeventToRemove);

        return "subevent has been removed";
    }
}
