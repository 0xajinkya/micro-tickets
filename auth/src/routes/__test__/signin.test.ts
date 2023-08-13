import request from "supertest";
import { app } from "../../app";

it("fails when an email that does not exist is supplied", async() => {
    await request(app)
            .post("/api/users/signin")
            .send({
                email: "sd@as.com",
                password: "dfsdfgvg"
            })
            .expect(400);
});

it("fails when an incorrect pass is supplied", async() => {
    await request(app)
            .post("/api/users/signup")
            .send({
                email: "aji@aji.com",
                password: "ajiaji"
            })
            .expect(201)

    await request(app)
            .post("/api/users/signin")
            .send({
                email: "aji@aji.com",
                password: "ajiadfji"
            })
            .expect(400)
})


it("fails when an incorrect pass is supplied", async() => {
    await request(app)
            .post("/api/users/signup")
            .send({
                email: "aji@aji.com",
                password: "ajiaji"
            })
            .expect(201)

    await request(app)
            .post("/api/users/signin")
            .send({
                email: "aji@aji.com",
                password: "ajiadfji"
            })
            .expect(400)
})



