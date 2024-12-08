import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

export class UserController {
    private userRepository = AppDataSource.getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const user = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) {
            return "unregistered user";
        }
        return user;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, username, hashedPassword, email } =
            request.body;

        const user = Object.assign(new User(), {
            firstName,
            lastName,
            username,
            hashedPassword,
            email,
        });

        return this.userRepository.save(user);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const body = request.body;

        let existingDetails = await this.userRepository.findOneBy({ id });

        if (!existingDetails) {
            return "this user does not exist";
        }

        await this.userRepository.update(id, body);

        let newDetails = await this.userRepository.findOneBy({ id });

        return newDetails;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let userToRemove = await this.userRepository.findOneBy({ id });

        if (!userToRemove) {
            return "this user does not exist";
        }

        await this.userRepository.remove(userToRemove);

        return "user has been removed";
    }
}
