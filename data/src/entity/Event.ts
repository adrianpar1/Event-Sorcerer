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
import { Subevent } from "./Subevent";
import { Attendee } from "./Attendee";

@Entity()
export class Event {
    @Column()
    eventName: string;

    // determine if format needs to be changed later
    @Column({ type: "date" })
    eventDate: Date;

    @Column()
    eventDescription: string;

    @OneToMany(() => Task, (task) => task.event, { onDelete: "CASCADE" })
    tasks: Task[];

    @OneToOne(() => Budget, (budget) => budget.event, { onDelete: "CASCADE" })
    budget: Budget;

    @OneToMany(() => Subevent, (subevent) => subevent.event, {
        onDelete: "CASCADE",
    })
    subevents: Subevent[];

    @OneToMany(() => Attendee, (attendee) => attendee.event, {
        onDelete: "CASCADE",
    })
    attendees: Attendee[];

    @PrimaryGeneratedColumn()
    id: number;
}
