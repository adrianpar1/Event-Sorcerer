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
            subeventOrder,
        } = request.body;

        const itinerary = Object.assign(new Itinerary(), {
            subeventName,
            subeventDate,
            subeventTime,
            subeventPoc,
            subeventDescription,
            subeventOrder,
        });

        return this.itineraryRepository.save(itinerary);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let itineraryToRemove = await this.itineraryRepository.findOneBy({
            id,
        });

        if (!itineraryToRemove) {
            throw Error("these subevent details do not exist");
        }

        await this.itineraryRepository.remove(itineraryToRemove);

        return "subevent details have been removed";
    }
}
