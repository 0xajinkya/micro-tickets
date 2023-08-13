import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener, TicketUpdatedListener } from "./events/listeners";

const start = async () => {
	console.log(process.env.JWT_KEY);
	console.log(process.env.MONGO_URI);
	if (!process.env.JWT_KEY) {
		throw new Error("JWT Key not found");
	}
	if (!process.env.MONGO_URI) {
		throw new Error("Mongo URI not found");
	}
	if (!process.env.NATS_CLIENT_ID) {
		throw new Error("NATS_CLIENT_ID Key not found");
	}
	if (!process.env.NATS_URL) {
		throw new Error("NATS_URL not found");
	}
	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error("NATS_CLUSTER_ID not found");
	}

	try {
		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID,
			process.env.NATS_CLIENT_ID,
			process.env.NATS_URL
		);
		natsWrapper.client.on("close", () => {
			console.log("NATS connection closed!");
			process.exit();
		});
		process.on("SIGINT", () => natsWrapper.client.close());
		process.on("SIGTERM", () => natsWrapper.client.close());

		new TicketCreatedListener(natsWrapper.client).listen();
		new TicketUpdatedListener(natsWrapper.client).listen();

		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to mongo");
	} catch (error) {
		console.error(error);
	}
	app.listen(3000, () => {
		console.log("Listening on port 3000!!!!");
	});
};

start();
