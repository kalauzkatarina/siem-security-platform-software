import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { toDTO } from "./ConvertToDTO";

export function ArraytoDTO(events:Event[]): EventDTO[] {
      const eventDTOs: EventDTO[] = [];
    
        for(let i = 0; i < events.length; i++) {
            eventDTOs.push(toDTO(events[i]));
        }
    
      return eventDTOs;
    }