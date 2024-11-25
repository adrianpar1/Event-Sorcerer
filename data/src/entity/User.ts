import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
    @Column({ unique: true })
    username: string;

    @Column({ select: false })
    password: string;

    // figure out password hashing mechanism later
    @Column()
    hashedPassword: string;

    @Column()
    email: string;

    @Column()
    role: string;

    @Column()
    company: string;

    @PrimaryGeneratedColumn()
    id: number;

    // determine if data type needs to be changed later
    @UpdateDateColumn({ type: "timestamp" })
    lastLogin: Date;
}
