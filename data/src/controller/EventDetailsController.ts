import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { EventDetails } from "../entity/EventDetails";

export class EventDetailsController {
   private detailsRepository = AppDataSource.getRepository(EventDetails);

   async all(request: Request, response: Response, next: NextFunction) {
      return this.detailsRepository.find();
   }

   async one(request: Request, response: Response, next: NextFunction) {
      const id = parseInt(request.params.id);

      const user = await this.detailsRepository.findOne({
         where: { id },
      });

      if (!user) {
         return "unregistered user";
      }
      return user;
   }

   async save(request: Request, response: Response, next: NextFunction) {
      const { eventName, eventDate, eventTime, eventLocation, eventDescription,
              rsvpLink, rsvpDueDate, rsvpDueTime
       } = request.body;

      const details = Object.assign(new EventDetails(), {
         eventName,
         eventDate,
         eventTime,
         eventLocation,
         eventDescription,
         rsvpLink,
         rsvpDueDate,
         rsvpDueTime
      });

      return this.detailsRepository.save(details);
   }

   async remove(request: Request, response: Response, next: NextFunction) {
      const id = parseInt(request.params.id);

      let eventToRemove = await this.detailsRepository.findOneBy({ id });

      if (!eventToRemove) {
         throw Error("this event does not exist");
      }

      await this.detailsRepository.remove(eventToRemove);

      return "event has been removed";
   }
}
