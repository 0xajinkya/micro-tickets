import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
	console.log(process.env.JWT_KEY);
	console.log(process.env.MONGO_URI);
	if(!process.env.JWT_KEY){
		throw new Error("JWT Key not found");
	}
	if(!process.env.MONGO_URI){
		throw new Error("Mongo URI not found");
	}
	try {
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