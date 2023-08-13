import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUserRouter, signinRouter, signoutRouter, signupRouter } from "./routes";
import {NotFoundError} from "@akorg/common"
// import "express-async-errors";
import { errorHandler } from "./middlewares";

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(cookieSession({
	signed: false,
	// secure: process.env.NODE_ENV !== "test"
	secure: false
}));
app.get("/api/users", (req, res) => res.status(200).json({message: "OK"}));
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.get("*", (req, res, next) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app }