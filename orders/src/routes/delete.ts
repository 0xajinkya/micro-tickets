import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from "@akorg/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../model/order";
import { OrderCancelledPublisher } from "../events/publishers";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
    "/api/orders/:orderId", 
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
        const { orderId } = req.params;
        try {
            const order = await Order.findById(orderId).populate("ticket");

            if(!order){
                throw new NotFoundError();
            }
            if(order.userId !== req.currentUser!.id){
                throw new NotAuthorizedError();
            }
            order.status = OrderStatus.Cancelled;
            await order.save();
            new OrderCancelledPublisher(natsWrapper.client).publish({
                id: order.id,
                version: order.version,
                ticket: {
                    id: order.ticket.id
                }
            })
            res.status(204).send(order);
        } catch (error: any) {
            next(error);
        }
})

export { router as deleteOrderRouter };