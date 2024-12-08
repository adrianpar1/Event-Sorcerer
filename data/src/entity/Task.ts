import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Event } from "./Event";

@Entity()
export class Task {
    @Column()
    taskName: string;

    @Column({ type: "date" })
    date: Date;

    @Column()
    assignedTo: string;

    @ManyToOne(() => Event, (event) => event.tasks)
    event: Event;

    @PrimaryGeneratedColumn()
    id: number;
}
