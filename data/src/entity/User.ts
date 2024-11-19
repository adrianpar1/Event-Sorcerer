import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
   @Column()
   firstName: string;

   @Column()
   lastName: string;

   @Column()
   age: number;

   @PrimaryGeneratedColumn()
   id: number;
}
