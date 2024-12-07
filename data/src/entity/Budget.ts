import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
} from "typeorm";
import { Event } from "./Event";
import { BudgetItem } from "./BudgetItem";

@Entity()
export class Budget {
    @Column({ type: "float" })
    totalBudget: number;

    @OneToMany(() => BudgetItem, (budgetItem) => budgetItem.budget)
    budgetItem: number;

    // BUG - "Property "event" was not found in "Budget". Make sure your query is correct."
    @OneToOne(() => Event, (event) => event.budget)
    event: Event;

    @PrimaryGeneratedColumn()
    id: number;
}
