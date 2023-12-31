import { requireAuth, validateRequest } from "@akorg/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { body } from "express-validator";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
	"/api/tickets",
	requireAuth,
	[
		body("title").not().isEmpty().withMessage("Title is required"),
		body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")
	],
	validateRequest,
	async (req: Request, res: Response, next: NextFunction) => {
		const { title, price } = req.body;

		try {
			const ticket = Ticket.build({
				title,
				price,
				userId: req.currentUser!.id
			});
			await ticket.save();
			await new TicketCreatedPublisher(natsWrapper.client).publish({
				id: ticket.id,
				title: ticket.title,
				price: ticket.price,
				userId: ticket.userId,
				version: ticket.version
			});

			res.status(201).json(ticket);
		} catch (error) {
			next(error);
		}
	}
);

export { router as createTicketRouter };
