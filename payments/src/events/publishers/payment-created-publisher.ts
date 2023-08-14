import { Subjects, Publisher, PaymentCreatedEvent } from "@akorg/common";
export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}