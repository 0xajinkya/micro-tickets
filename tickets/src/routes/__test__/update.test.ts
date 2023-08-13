import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

declare var global: NodeJS.Global;

it("returns a 404 if the provided id does not exists", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set("Cookie", global.signin())
		.send({
			title: "Ajinkya",
			price: 20
		})
		.expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: "Ajiniya",
			price: 20
		})
		.expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
	const res = await request(app).post("/api/tickets").set("Cookie", global.signin()).send({
		title: "Ajinkya",
		price: 20
	});

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set("Cookie", global.signin())
		.send({
			title: "ASdfsgd",
			price: 12345
		})
		.expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
	const cookie = global.signin();

	const res = await request(app).post("/api/tickets").set("Cookie", cookie).send({
		title: "asds",
		price: 20
	});
	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "",
			price: 20
		})
		.expect(400);
	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "scsvs",
			price: -10
		})
		.expect(400);
});

it("updates the ticket valid title & price", async () => {
	const cookie = global.signin();

	const res = await request(app).post("/api/tickets").set("Cookie", cookie).send({
		title: "asds",
		price: 20
	});
	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 20
		})
		.expect(200);

	const ticketRes = await request(app).get(`/api/tickets/${res.body.id}`).send();

    expect(ticketRes.body.title).toEqual("new title");
    expect(ticketRes.body.price).toEqual(20);
});

it("publishes an event", async() => {
	const cookie = global.signin()

	const res = await request(app).post("/api/tickets").set("Cookie", cookie).send({
		title: "asds",
		price: 20
	});
	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 20
		})
		.expect(200);
	expect(natsWrapper.client.publish).toHaveBeenCalled();
})