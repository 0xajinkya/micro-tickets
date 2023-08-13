import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tickets = await Ticket.find({});

		res.status(200).json(tickets);
	} catch (error) {
		next(error);
	}
});

export { router as indexTicketRouter };
