import request from "supertest";
import { app } from "../../app";

declare var global: NodeJS.Global;

const createTicket = () => {
    return request(app)
            .post("/api/tickets")
            .set("Cookie", global.signin())
            .send({
                title: "MinuNAjinkya",
                price: 10000000000000000000000
            })
};

it("can fetch a list of tickets", async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const res = await request(app)
                        .get("/api/tickets")
                        .send()
                        .expect(200);
    expect(res.body.length).toEqual(3);
})