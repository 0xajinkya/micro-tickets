import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError, RequestValidationError, DatabaseConnectionError } from "@akorg/common";

const router = express.Router();

router.post(
	"/api/users/signup",
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4 and 20 characters")
	],
	validateRequest,
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;

		try {
			const existingUser = await User.findOne({ email });

		if(existingUser){
			console.log("Email in use");
			throw new BadRequestError("Email in use");
		}
		const user = User.build({ email, password });
		await user.save();

		const userJwt =  jwt.sign({
			id: user.id,
			email: user.email
		}, process.env.JWT_KEY!);

		req.session = {
			jwt: userJwt
		};

		res.status(201).json(user);
		} catch (error) {
			// Pass the error to the errorHandler middleware
			next(error);
			console.log(error)
		}
	}
);

export { router as signupRouter };
