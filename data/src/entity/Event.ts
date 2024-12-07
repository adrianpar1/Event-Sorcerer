import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
    JoinColumn,
} from "typeorm";
import { Task } from "./Task";
import { Budget } from "./Budget";

@Entity()
export class Event {
    @Column()
    eventName: string;

    // determine if format needs to be changed later
    @Column({ type: "date" })
    eventDate: Date;

    @Column()
    eventDescription: string;

    @OneToMany(() => Task, (task) => task.event)
    tasks: Task[];

    @OneToOne(() => Budget, (budget) => budget.event, { cascade: true })
    @JoinColumn({ name: "budget", referencedColumnName: "id" })
    budget: Budget[];

    @PrimaryGeneratedColumn()
    id: number;
}
