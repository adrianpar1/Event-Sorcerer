import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Participant } from "../entity/Participant";

export class ParticipantController {
   private participantsRepository = AppDataSource.getRepository(Participant);

   async all(request: Request, response: Response, next: NextFunction) {
      return this.participantsRepository.find();
   }

   async one(request: Request, response: Response, next: NextFunction) {
      const id = parseInt(request.params.id);

      const participant = await this.participantsRepository.findOne({
         where: { id },
      });

      if (!participant) {
         return "no participant data found";
      }
      return participant;
   }

   async save(request: Request, response: Response, next: NextFunction) {
      const {
         firstName,
         lastName,
         email,
         phone,
         username,
         admin,
         eventId,
         id,
      } = request.body;

      const participant = Object.assign(new Participant(), {
         firstName,
         lastName,
         email,
         phone,
         username,
         admin,
         eventId,
         id,
      });

      return this.participantsRepository.save(participant);
   }

   async remove(request: Request, response: Response, next: NextFunction) {
      const id = parseInt(request.params.id);

      let participantToRemove = await this.participantsRepository.findOneBy({ id });

      if (!participantToRemove) {
         throw Error("this participant does not exist");
      }

      await this.participantsRepository.remove(participantToRemove);

      return "participant has been removed";
   }
}
