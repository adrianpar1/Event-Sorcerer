import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Task } from "../entity/Task";

export class TaskController {
    private taskRepository = AppDataSource.getRepository(Task);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.taskRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const task = await this.taskRepository.findOne({
            where: { id },
        });

        if (!task) {
            return "task not found";
        }
        return task;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { taskName, eventId, date, assignedTo } = request.body;

        const details = Object.assign(new Task(), {
            taskName,
            eventId,
            date,
            assignedTo,
        });

        return this.taskRepository.save(details);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const body = request.body;

        let existingTask = await this.taskRepository.findOneBy({ id });

        if (!existingTask) {
            return "this task does not exist";
        }

        await this.taskRepository.update(id, body);

        let newTask = await this.taskRepository.findOneBy({ id });

        return newTask;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let taskToRemove = await this.taskRepository.findOneBy({ id });

        if (!taskToRemove) {
            return "this task does not exist";
        }

        await this.taskRepository.remove(taskToRemove);

        return "task has been removed";
    }
}
