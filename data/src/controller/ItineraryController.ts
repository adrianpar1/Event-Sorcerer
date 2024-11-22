import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Itinerary } from "../entity/Itinerary";

export class ItineraryController {
    private itineraryRepository = AppDataSource.getRepository(Itinerary);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.itineraryRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const subeventOrder = parseInt(request.params.subeventOrder);

        const itinerary = await this.itineraryRepository.findOne({
            where: { subeventOrder },
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

    async remove(request: Request, response: Response, next: NextFunction) {
        const subeventOrder = parseInt(request.params.subeventOrder);

        let itineraryToRemove = await this.itineraryRepository.findOneBy({
            subeventOrder,
        });

        if (!itineraryToRemove) {
            throw Error("these subevent details do not exist");
        }

        await this.itineraryRepository.remove(itineraryToRemove);

        return "subevent details have been removed";
    }
}
