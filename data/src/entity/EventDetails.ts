import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class EventDetails {
   @Column()
   eventName: string;

   // determine if format needs to be changed later
   @Column()
   eventDate: date;

   // determine if format needs to be changed later
   @Column()
   eventTime: time;

   @Column()
   eventLocation: string;

   @Column()
   eventDescription: string;

   @Column()
   rsvpLink: string;

   // determine if format needs to be changed later
   @Column()
   rsvpDueDate: date;

   // determine if format needs to be changed later
   @Column()
   rsvpDueTime: time;

   @PrimaryGeneratedColumn()
   id: number;
}