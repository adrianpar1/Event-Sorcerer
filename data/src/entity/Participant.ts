import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { EventDetails } from "./EventDetails";

@Entity()
export class Participant {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    // determine if data type needs to be changed later
    @Column()
    phone: string;

    @Column({ unique: true })
    username: string;

    @Column()
    admin: boolean;

    @ManyToOne(() => EventDetails, (eventId) => eventId.participants)
    @Column()
    eventId: number;

    @PrimaryGeneratedColumn()
    id: number;
}
