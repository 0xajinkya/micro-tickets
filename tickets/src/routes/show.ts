import { NotFoundError } from "@akorg/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async(req: Request, res: Response, next: NextFunction) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket){
            throw new NotFoundError();
        }
        res.status(200).json(ticket)
    } catch (error) {
        next(error)
    }
});

export { router as showTicketRouter }