import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

   @Column()
   username: string;

   @Column()
   admin: boolean;

   @PrimaryGeneratedColumn()
   id: number;
}
