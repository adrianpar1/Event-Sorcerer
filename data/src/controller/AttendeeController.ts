import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Attendee } from "../entity/Attendee";

export class AttendeeController {
    private attendeeRepository = AppDataSource.getRepository(Attendee);

    async all(request: Request, response: Response, next: NextFunction) {
        const attendees = await this.attendeeRepository
            .createQueryBuilder("attendee")
            .leftJoinAndSelect("attendee.event", "event")
            .getMany();

        return attendees;
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const attendee = await this.attendeeRepository
            .createQueryBuilder("attendee")
            .leftJoinAndSelect("attendee.event", "event")
            .where({ id })
            .getOne();

        if (!attendee) {
            return "no attendee found";
        }
        return attendee;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, username, event } = request.body;

        const details = Object.assign(new Attendee(), {
            firstName,
            lastName,
            username,
            event,
        });

        return this.attendeeRepository.save(details);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const body = request.body;

        const existingAttendee = await this.attendeeRepository
            .createQueryBuilder("attendee")
            .leftJoinAndSelect("attendee.event", "event")
            .where({ id })
            .getOne();

        if (!existingAttendee) {
            return "this attendee does not exist";
        }

        await this.attendeeRepository.update(id, body);

        const newAttendee = await this.attendeeRepository
            .createQueryBuilder("attendee")
            .leftJoinAndSelect("attendee.event", "event")
            .where({ id })
            .getOne();

        return newAttendee;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const attendeeToRemove = await this.attendeeRepository
            .createQueryBuilder("attendee")
            .leftJoinAndSelect("attendee.event", "event")
            .where({ id })
            .getOne();

        if (!attendeeToRemove) {
            return "this attendee does not exist";
        }

        await this.attendeeRepository.remove(attendeeToRemove);

        return "attendee has been removed";
    }
}
