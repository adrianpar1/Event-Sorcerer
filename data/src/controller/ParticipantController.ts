import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Participant } from "../entity/Participant";

export class ParticipantController {
    private participantRespository = AppDataSource.getRepository(Participant);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.participantRespository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const participant = await this.participantRespository.findOne({
            where: { id },
        });

        if (!participant) {
            return "no participant data found";
        }
        return participant;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const {
            firstName,
            lastName,
            email,
            phone,
            username,
            admin,
            eventId,
            id,
        } = request.body;

        const participant = Object.assign(new Participant(), {
            firstName,
            lastName,
            email,
            phone,
            username,
            admin,
            eventId,
            id,
        });

        return this.participantRespository.save(participant);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const body = request.body;

        let existingDetails = await this.participantRespository.findOneBy({
            id,
        });

        if (!existingDetails) {
            return "this participant does not exist";
        }

        await this.participantRespository.update(id, body);

        let newDetails = await this.participantRespository.findOneBy({ id });

        return newDetails;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let participantToRemove = await this.participantRespository.findOneBy({
            id,
        });

        if (!participantToRemove) {
            return "this participant does not exist";
        }

        await this.participantRespository.remove(participantToRemove);

        return "participant has been removed";
    }
}
