import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Subevent } from "../entity/Subevent";

export class SubeventController {
    private subeventRepository = AppDataSource.getRepository(Subevent);

    async all(request: Request, response: Response, next: NextFunction) {
        const subevents = await this.subeventRepository
            .createQueryBuilder("subevent")
            .leftJoinAndSelect("subevent.event", "event")
            .orderBy("subevent.id")
            .getMany();

        return subevents;
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const subevent = await this.subeventRepository
            .createQueryBuilder("subevent")
            .leftJoinAndSelect("subevent.event", "event")
            .where({ id })
            .getOne();

        if (!subevent) {
            return "no subevent details found";
        }

        return subevent;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { subeventTime, subeventDescription, event } = request.body;

        const subevent = Object.assign(new Subevent(), {
            subeventTime,
            subeventDescription,
            event,
        });

        return this.subeventRepository.save(subevent);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        let id = parseInt(request.params.id);
        const body = request.body;

        const existingSubevent = await this.subeventRepository
            .createQueryBuilder("subevent")
            .leftJoinAndSelect("subevent.event", "event")
            .where({ id })
            .getOne();

        if (!existingSubevent) {
            return "this subevent does not exist";
        }

        await this.subeventRepository.update(id, body);
        id = parseInt(request.params.id);

        const newSubevent = await this.subeventRepository
            .createQueryBuilder("subevent")
            .leftJoinAndSelect("subevent.event", "event")
            .where({ id })
            .getOne();

        return newSubevent;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const subeventToRemove = await this.subeventRepository
            .createQueryBuilder("subevent")
            .leftJoinAndSelect("subevent.event", "event")
            .where({ id })
            .getOne();

        if (!subeventToRemove) {
            return "this subevent does not exist";
        }

        await this.subeventRepository.remove(subeventToRemove);

        return "subevent has been removed";
    }
}
