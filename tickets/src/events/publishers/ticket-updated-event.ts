import { Publisher, Subjects, TicketUpdatedEvent } from "@akorg/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}