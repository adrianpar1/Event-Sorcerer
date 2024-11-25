import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Itinerary } from "./Itinerary";
import { Participant } from "./Participant";

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

    @Column({ nullable: true })
    rsvpLink: string;

    // determine if format needs to be changed later
    @Column({ type: "date", nullable: true })
    rsvpDueDate: Date;

    // determine if format needs to be changed later
    @Column({ type: "time", nullable: true })
    rsvpDueTime: Date;

    @OneToMany(() => Itinerary, (subevents) => subevents.eventId)
    subevents: Itinerary[];

    @OneToMany(() => Participant, (participants) => participants.eventId)
    participants: Participant[];

    @PrimaryGeneratedColumn()
    id: number;
}
