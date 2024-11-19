import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Itinerary } from "../entity/Itinerary";

export class Itinerary {
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
            return "no event details found";
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

        if (!detailsToRemove) {
            throw Error("these event details do not exist");
        }

        await this.detailsRepository.remove(detailsToRemove);

        return "event details have been removed";
    }
}
