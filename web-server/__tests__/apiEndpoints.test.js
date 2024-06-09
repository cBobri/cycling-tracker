require("dotenv").config();

const request = require("supertest");
const app = require("../app");

describe("API endpoints", () => {
    let token;

    describe("GET /api/routes", () => {
        it("should respond with status 200", async () => {
            const response = await request(app).get("/api/routes");
            expect(response.status).toBe(200);
        });
    });

    describe("POST /api/login", () => {
        it("should respond with status 402 for invalid password", async () => {
            const response = await request(app).post("/api/users/login").send({
                email_username: process.env.TEST_USERNAME,
                password: "123",
            });
            expect(response.status).toBe(402);
        });

        it("should respond with status 200 for valid credentials", async () => {
            const response = await request(app).post("/api/users/login").send({
                email_username: process.env.TEST_USERNAME,
                password: process.env.TEST_PASSWORD,
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
            token = response.body.token;
        });
    });

    describe("GET /api/users/profile", () => {
        it("should respond with status 200 and the user's profile", async () => {
            const response = await request(app)
                .get("/api/users/profile")
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("email");
            expect(response.body).toHaveProperty("username");
            expect(response.body).toHaveProperty("avgPower");
            expect(response.body).toHaveProperty("avgProIndex");
        });
    });

    describe("GET /api/routes/user", () => {
        it("should respond with status 200 and the user's routes", async () => {
            const response = await request(app)
                .get("/api/routes/user")
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
    });
});
