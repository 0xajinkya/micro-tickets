import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {NotFoundError, currentUser, errorHandler} from "@akorg/common"
import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes/index';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(cookieSession({
	signed: false,
	secure: process.env.NODE_ENV !== "test"
}));
app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all("*", (req, res, next) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app }