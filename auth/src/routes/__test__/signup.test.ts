import request from "supertest";
import { app } from "../../app";

it("return a 201 on successful signup", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password"
		})
		.expect(201);
});

it("returns a 400 with an invalid email", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.",
			password: "password"
		})
		.expect(400);
});

it("returns a 400 with an invalid password", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "p"
		})
		.expect(400);
});

it("returns a 400 with missing email and password", async () => {
	await request(app).post("/api/users/signup").send({ email: "kahane@gmail.com" }).expect(400);
	return request(app).post("/api/users/signup").send({ password: "1234567ujhgfd" }).expect(400);
});

// it("disallows duplicate emails", async () => {
// 	await request(app)
// 		.post("/api/users/signup")
// 		.send({
// 			email: "test@test.com",
// 			password: "password"
// 		})
// 		.expect(201);

// 	return request(app)
// 		.post("/api/users/signup")
// 		.send({
// 			email: "test@test.com",
// 			password: "password"
// 		})
// 		.expect(400);
// });


it("sets a cookie after successful signup", async() => {
    const response = await request(app)
		.post("/api/users/signup")
		.send({
			email: "test1@test1.com",
			password: "password"
		})
		.expect(201);
    expect(response.get("Set-Cookie")).toBeDefined();
})  
