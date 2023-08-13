import express, { Request, Response, NextFunction } from "express";
import { validateRequest, BadRequestError } from "@akorg/common";
import { body } from "express-validator";
import { User } from "../models/user";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(
	"/api/users/signin",
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
			if (!existingUser) {
				throw new BadRequestError("Login request failed");
			}

			const passMatch = Password.compare(existingUser.password, password);

			if (!passMatch) {
				throw new BadRequestError("Invalid credentials");
			}

			const userJwt = jwt.sign(
				{
					id: existingUser.id,
					email: existingUser.email
				},
				process.env.JWT_KEY!
			);

			req.session = {
				jwt: userJwt
			};

			console.log(req.session)

			return res.status(200).json(existingUser);
		} catch (error) {
			// Pass the error to the errorHandler middleware
			// next(error);
			console.log(error)
		}
	}
);

export { router as signinRouter };
