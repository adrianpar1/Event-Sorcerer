import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Itinerary {
    @Column()
    subeventName: string;

    // determine if format needs to be changed later
    @Column()
    subeventDate: date;

    // determine if format needs to be changed later
    @Column()
    subeventTime: time;

    @Column()
    subeventPoc: string;

    @Column()
    subeventDescription: string;

    @Column()
    eventId: number;

    @PrimaryColumn()
    subeventOrder: number;
}
