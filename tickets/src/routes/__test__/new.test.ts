import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

declare var global: NodeJS.Global;

it("has a route handler listening to /api/tickets for post requests", async () => {
	const res = await request(app).post("/api/tickets").send({});
	console.log(res);
	expect(res.statusCode).not.toEqual(404);
});

it("can only be acessed if the user is signed in", async () => {
	await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
	const res = await request(app).post("/api/tickets").set("Cookie", global.signin()[0]).send({});
	console.log(global.signin())
	expect(res.statusCode).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
	await request(app)
			.post("/api/tickets")
			.set("Cookie", global.signin())
			.send({
				title: "",
				price: 10
			})
			.expect(400);

	await request(app)
			.post("/api/tickets")
			.set("Cookie", global.signin())
			.send({
				price: 10
			})
			.expect(400);
});

it("returns an error if an invalid price is provided", async () => {
	await request(app)
			.post("/api/tickets")
			.set("Cookie", global.signin())
			.send({
				title: "Ajinkya",
				price: -10
			})
			.expect(400)
			await request(app)
					.post("/api/tickets")
					.set("Cookie", global.signin())
					.send({
						title: "Minu",
					})
					.expect(400);
});

it("created a ticket with valid inputs ", async () => {
	let tickets = await Ticket.find();
	expect(tickets.length).toEqual(0);

	const title = "Ajinkya"
	const price = 100

	await request(app)
			.post("/api/tickets")
			.set("Cookie", global.signin())
			.send({
				title,
				price: 20,
			})
			.expect(201);

	tickets = await Ticket.find();
	expect(tickets.length).toEqual(1);
	expect(tickets[0].price).toEqual(price);
	expect(tickets[0].title).toEqual(title);
});

it("publishes an event", async() => {
	const title = "assdf";
	await request(app)
			.post("/api/tickets")
			.set("Cookie", global.signin())
			.send({
				title,
				price: 29
			})
			.expect(201);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
})