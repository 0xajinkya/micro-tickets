import { Publisher, Subjects, ExpirationCompleteEvent } from "@akorg/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}