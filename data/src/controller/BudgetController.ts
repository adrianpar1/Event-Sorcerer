import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Budget } from "../entity/Budget";

export class BudgetController {
    private budgetRepository = AppDataSource.getRepository(Budget);

    async all(request: Request, response: Response, next: NextFunction) {
        const budgets = await this.budgetRepository
            .createQueryBuilder("budget")
            .leftJoinAndSelect("budget.budgetItem", "budgetItem")
            .leftJoinAndSelect("budget.event", "event")
            .orderBy("budget.id")
            .getMany();

        return budgets;
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const budget = await this.budgetRepository
            .createQueryBuilder("budget")
            .leftJoinAndSelect("budget.budgetItem", "budgetItem")
            .leftJoinAndSelect("budget.event", "event")
            .where({ id })
            .getOne();

        if (!budget) {
            return "no budget found";
        }
        return budget;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { totalBudget, event } = request.body;

        const budget = Object.assign(new Budget(), {
            totalBudget,
            event,
        });

        return this.budgetRepository.save(budget);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const body = request.body;

        const existingBudget = await this.budgetRepository
            .createQueryBuilder("budget")
            .leftJoinAndSelect("budget.budgetItem", "budgetItem")
            .where({ id })
            .getOne();

        if (!existingBudget) {
            return "this budget does not exist";
        }

        await this.budgetRepository.update(id, body);

        const newBudget = await this.budgetRepository
            .createQueryBuilder("budget")
            .leftJoinAndSelect("budget.budgetItem", "budgetItem")
            .where({ id })
            .getOne();

        return newBudget;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let budgetToRemove = await this.budgetRepository
            .createQueryBuilder("budget")
            .leftJoinAndSelect("budget.budgetItem", "budgetItem")
            .where({ id })
            .getOne();

        if (!budgetToRemove) {
            return "this budget does not exist";
        }

        await this.budgetRepository.remove(budgetToRemove);

        return "budget has been removed";
    }
}
