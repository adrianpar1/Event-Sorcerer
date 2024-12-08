import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Event } from "./Event";

@Entity()
export class Attendee {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    username: string;

    @ManyToOne(() => Event, (event) => event.attendees)
    event: Event;

    @PrimaryGeneratedColumn()
    id: number;
}
