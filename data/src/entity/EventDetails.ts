import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class EventDetails {
    @Column()
    eventName: string;

    // determine if format needs to be changed later
    @Column({ type: "date" })
    eventDate: Date;

    // determine if format needs to be changed later
    @Column({ type: "time" })
    eventTime: Date;

    @Column()
    eventLocation: string;

    @Column()
    eventDescription: string;

    @Column()
    rsvpLink: string;

    // determine if format needs to be changed later
    @Column({ type: "date" })
    rsvpDueDate: Date;

    // determine if format needs to be changed later
    @Column({ type: "time" })
    rsvpDueTime: Date;

    @PrimaryGeneratedColumn()
    id: number;
}
