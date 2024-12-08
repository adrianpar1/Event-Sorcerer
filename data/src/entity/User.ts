import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    username: string;

    // figure out password hashing mechanism later
    @Column()
    hashedPassword: string;

    @Column()
    email: string;

    @PrimaryGeneratedColumn()
    id: number;
}
