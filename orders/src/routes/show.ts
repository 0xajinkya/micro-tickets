import { NotAuthorizedError, NotFoundError, requireAuth } from "@akorg/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../model/order";

const router = express.Router();

router.get(
	"/api/orders/:orderId",
	requireAuth,
	async (req: Request, res: Response, next: NextFunction) => {
		const { orderId } = req.params;

		try {
			const order = await Order.findById(orderId).populate("ticket");
			if (!order) {
				throw new NotFoundError();
			}

			if (order.userId !== req.currentUser!.id) {
				throw new NotAuthorizedError();
			}
			res.status(200).json(order);
		} catch (error) {
			next(error);
		}
	}
);

export { router as showOrderRouter };
