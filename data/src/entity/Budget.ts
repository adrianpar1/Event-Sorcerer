import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

@Entity()
export class Budget {
    @Column({ type: "float" })
    totalBudget: number;

    @Column()
    lastName: string;

    @Column({ unique: true })
    username: string;

    @PrimaryGeneratedColumn()
    id: number;
}
