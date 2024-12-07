import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Budget } from "../entity/Budget";

export class BudgetItemController {
    private itemRepository = AppDataSource.getRepository(Budget);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.itemRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const item = await this.itemRepository.findOne({
            where: { id },
        });

        if (!item) {
            return "no budget item found";
        }
        return item;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { expenseAmount, expenseDescription, budget } = request.body;

        const details = Object.assign(new Budget(), {
            expenseAmount,
            expenseDescription,
            budget,
        });

        return this.itemRepository.save(details);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const body = request.body;

        let existingBudget = await this.itemRepository.findOneBy({ id });

        if (!existingBudget) {
            return "this budget item does not exist";
        }

        await this.itemRepository.update(id, body);

        let newBudget = await this.itemRepository.findOneBy({ id });

        return newBudget;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let itemToRemove = await this.itemRepository.findOneBy({ id });

        if (!itemToRemove) {
            return "this budget item does not exist";
        }

        await this.itemRepository.remove(itemToRemove);

        return "budget item has been removed";
    }
}
