import { CustomError, DatabaseConnectionError, RequestValidationError } from "@akorg/common";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof CustomError) {
		return res.status(err.statusCode).json({ errors: err.serializeErrors() });
	}
	console.error(err); // Log the error for debugging purposes
	return res.status(400).json({ errors: [{ message: "Something went wrong" }] });
};