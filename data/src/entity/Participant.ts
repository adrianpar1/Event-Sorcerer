import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";

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

   @Column()
   eventId: number;

   @PrimaryGeneratedColumn()
   id: number;
}
