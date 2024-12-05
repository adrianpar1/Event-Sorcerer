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
    expenseAmount: string;

    @Column({ unique: true })
    expenseDescription: string;

    @PrimaryGeneratedColumn()
    id: number;
}
