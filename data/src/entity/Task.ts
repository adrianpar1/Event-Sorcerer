import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

@Entity()
export class Task {
    @Column({ type: "float" })
    taskName: number;

    @Column()
    eventId: string;

    @Column({ type: "date" })
    date: Date;

    @Column()
    assignedTo: string;

    @PrimaryGeneratedColumn()
    id: number;
}
