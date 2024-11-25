import {
    Entity,
    PrimaryColumn,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { EventDetails } from "./EventDetails";

@Entity()
export class Itinerary {
    @Column()
    subeventName: string;

    // determine if format needs to be changed later
    @Column({ type: "date" })
    subeventDate: Date;

    // determine if format needs to be changed later
    @Column({ type: "time" })
    subeventTime: Date;

    @Column()
    subeventPoc: string;

    @Column()
    subeventDescription: string;

    @ManyToOne(() => EventDetails, (eventId) => eventId.subevents)
    @JoinColumn({ name: "eventId" })
    eventId: number;

    @Column()
    subeventOrder: number;

    @PrimaryGeneratedColumn()
    id: number;
}
