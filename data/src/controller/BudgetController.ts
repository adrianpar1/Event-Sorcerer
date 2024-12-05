import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Budget } from "../entity/Budget";

export class BudgetController {
    private budgetRepository = AppDataSource.getRepository(Budget);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.budgetRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const budget = await this.budgetRepository.findOne({
            where: { id },
        });

        if (!budget) {
            return "no budget found";
        }
        return budget;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { totalBudget, expenseAmount, expenseDescription } = request.body;

        const details = Object.assign(new Budget(), {
            totalBudget,
            expenseAmount,
            expenseDescription,
        });

        return this.budgetRepository.save(details);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const body = request.body;

        let existingBudget = await this.budgetRepository.findOneBy({ id });

        if (!existingBudget) {
            return "this budget does not exist";
        }

        await this.budgetRepository.update(id, body);

        let newBudget = await this.budgetRepository.findOneBy({ id });

        return newBudget;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let budgetToRemove = await this.budgetRepository.findOneBy({ id });

        if (!budgetToRemove) {
            return "this budget does not exist";
        }

        await this.budgetRepository.remove(budgetToRemove);

        return "budget has been removed";
    }
}
