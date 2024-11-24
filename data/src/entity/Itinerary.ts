import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    eventId: number;

    @Column()
    subeventOrder: number;

    @PrimaryGeneratedColumn()
    id: number;
}
