import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Task } from "../entity/Task";

export class TaskController {
    private taskRepository = AppDataSource.getRepository(Task);

    async all(request: Request, response: Response, next: NextFunction) {
        const tasks = await this.taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.event", "event")
            .getMany();

        return tasks;
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const task = await this.taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.event", "event")
            .where({ id })
            .getOne();

        if (!task) {
            return "task not found";
        }
        return task;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { taskName, date, assignedTo, event } = request.body;

        const details = Object.assign(new Task(), {
            taskName,
            date,
            assignedTo,
            event,
        });

        return this.taskRepository.save(details);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const body = request.body;

        const existingTask = await this.taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.event", "event")
            .where({ id })
            .getOne();

        if (!existingTask) {
            return "this task does not exist";
        }

        await this.taskRepository.update(id, body);

        const newTask = await this.taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.event", "event")
            .where({ id })
            .getOne();

        return newTask;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const taskToRemove = await this.taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.event", "event")
            .where({ id })
            .getOne();

        if (!taskToRemove) {
            return "this task does not exist";
        }

        await this.taskRepository.remove(taskToRemove);

        return "task has been removed";
    }
}
