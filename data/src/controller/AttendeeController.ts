import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Attendee } from "../entity/Attendee";

export class AttendeeController {
    private attendeeRepository = AppDataSource.getRepository(Attendee);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.attendeeRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const attendee = await this.attendeeRepository.findOne({
            where: { id },
        });

        if (!attendee) {
            return "no attendee found";
        }
        return attendee;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, username } = request.body;

        const details = Object.assign(new Attendee(), {
            firstName,
            lastName,
            username,
        });

        return this.attendeeRepository.save(details);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const body = request.body;

        let existingAttendee = await this.attendeeRepository.findOneBy({ id });

        if (!existingAttendee) {
            return "this attendee does not exist";
        }

        await this.attendeeRepository.update(id, body);

        let newAttendee = await this.attendeeRepository.findOneBy({ id });

        return newAttendee;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let attendeeToRemove = await this.attendeeRepository.findOneBy({ id });

        if (!attendeeToRemove) {
            return "this attendee does not exist";
        }

        await this.attendeeRepository.remove(attendeeToRemove);

        return "attendee has been removed";
    }
}
