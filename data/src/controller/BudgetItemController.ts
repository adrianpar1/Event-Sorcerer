import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { BudgetItem } from "../entity/BudgetItem";

export class BudgetItemController {
    private itemRepository = AppDataSource.getRepository(BudgetItem);

    async all(request: Request, response: Response, next: NextFunction) {
        const items = await this.itemRepository
            .createQueryBuilder("budgetItem")
            .leftJoinAndSelect("budgetItem.budget", "budget")
            .getMany();

        return items;
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const item = await this.itemRepository
            .createQueryBuilder("budgetItem")
            .leftJoinAndSelect("budgetItem.budget", "budget")
            .where({ id })
            .getOne();

        if (!item) {
            return "no budget item found";
        }
        return item;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { expenseAmount, expenseDescription, budget } = request.body;

        const details = Object.assign(new BudgetItem(), {
            expenseAmount,
            expenseDescription,
            budget,
        });

        return this.itemRepository.save(details);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const body = request.body;

        const existingItem = await this.itemRepository
            .createQueryBuilder("budgetItem")
            .leftJoinAndSelect("budgetItem.budget", "budget")
            .where({ id })
            .getOne();

        if (!existingItem) {
            return "this budget item does not exist";
        }

        await this.itemRepository.update(id, body);

        const newItem = await this.itemRepository
            .createQueryBuilder("budgetItem")
            .leftJoinAndSelect("budgetItem.budget", "budget")
            .where({ id })
            .getOne();

        return newItem;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        const itemToRemove = await this.itemRepository
            .createQueryBuilder("budgetItem")
            .leftJoinAndSelect("budgetItem.budget", "budget")
            .where({ id })
            .getOne();

        if (!itemToRemove) {
            return "this budget item does not exist";
        }

        await this.itemRepository.remove(itemToRemove);

        return "budget item has been removed";
    }
}
