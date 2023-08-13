import { Publisher, OrderCancelledEvent, Subjects } from "@akorg/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;   
}