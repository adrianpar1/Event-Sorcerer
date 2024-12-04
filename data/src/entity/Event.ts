import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Event {
    @Column()
    eventName: string;

    // determine if format needs to be changed later
    @Column({ type: "date" })
    eventDate: Date;

    @Column()
    eventDescription: string;

    @PrimaryGeneratedColumn()
    id: number;
}
