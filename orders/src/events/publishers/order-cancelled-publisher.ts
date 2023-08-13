import { Publisher, OrderCreatedEvent, Subjects } from "@akorg/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;   
}