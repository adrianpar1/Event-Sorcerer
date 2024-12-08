import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { Event } from "./Event";
import { BudgetItem } from "./BudgetItem";

@Entity()
export class Budget {
    @Column({ type: "float" })
    totalBudget: number;

    @OneToMany(() => BudgetItem, (budgetItem) => budgetItem.budget)
    budgetItem: BudgetItem[];

    @OneToOne(() => Event, (event) => event.budget)
    @JoinColumn({ name: "event" })
    event: Event;

    @PrimaryGeneratedColumn()
    id: number;
}
