import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class EventDetails {
   @Column()
   eventName: string;

   @Column()
   eventDate: date;

   @Column()
   eventTime: time;

   @Column()
   eventLocation: string;

   @Column()
   eventDescription: string;

   @Column()
   rsvpLink: string;

   @Column()
   rsvpDueDate: date;

   @Column()
   rsvpDueTime: time;

   @PrimaryGeneratedColumn()
   id: number;
}