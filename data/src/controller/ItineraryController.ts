import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Itinerary } from "../entity/Itinerary";

export class ItineraryController {
    private itineraryRepository = AppDataSource.getRepository(Itinerary);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.itineraryRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const itinerary = await this.itineraryRepository.findOne({
            where: { id },
        });

        if (!itinerary) {
            return "no subevent details found";
        }

        return itinerary;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const {
            subeventName,
            subeventDate,
            subeventTime,
            subeventPoc,
            subeventDescription,
            eventId,
            subeventOrder,
        } = request.body;

        const itinerary = Object.assign(new Itinerary(), {
            subeventName,
            subeventDate,
            subeventTime,
            subeventPoc,
            subeventDescription,
            eventId,
            subeventOrder,
        });

        return this.itineraryRepository.save(itinerary);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        let id = parseInt(request.params.id);
        const body = request.body;

        let existingSubevent = await this.itineraryRepository.findOneBy({ id });

        if (!existingSubevent) {
            return "this subevent does not exist";
        }

        await this.itineraryRepository.update(id, body);
        id = parseInt(request.params.id);

        let newSubevent = await this.itineraryRepository.findOneBy({ id });

        return newSubevent;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let itineraryToRemove = await this.itineraryRepository.findOneBy({
            id,
        });

        if (!itineraryToRemove) {
            return "this subevent does not exist";
        }

        await this.itineraryRepository.remove(itineraryToRemove);

        return "subevent has been removed";
    }
}
