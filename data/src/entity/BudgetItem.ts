import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Budget } from "./Budget";

@Entity()
export class BudgetItem {
    @Column()
    expenseAmount: string;

    @Column()
    expenseDescription: string;

    @ManyToOne(() => Budget, (budget) => budget.budgetItem)
    budget: Budget;

    @PrimaryGeneratedColumn()
    id: number;
}
