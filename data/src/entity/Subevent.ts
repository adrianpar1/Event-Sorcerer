import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Event } from "./Event";

@Entity()
export class Subevent {
    // determine if format needs to be changed later
    @Column({ type: "time" })
    subeventTime: Date;

    @Column()
    subeventDescription: string;

    @ManyToOne(() => Event, (event) => event.subevents, { nullable: false })
    event: Event;

    @PrimaryGeneratedColumn()
    id: number;
}
