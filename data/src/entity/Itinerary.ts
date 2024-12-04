import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";

@Entity()
export class Itinerary {
    // determine if format needs to be changed later
    @Column({ type: "time" })
    subeventTime: Date;

    @Column()
    subeventDescription: string;

    @PrimaryGeneratedColumn()
    id: number;
}
