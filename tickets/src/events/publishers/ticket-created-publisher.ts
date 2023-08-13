import { Publisher, Subjects, TicketCreatedEvent } from "@akorg/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}