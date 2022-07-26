import app from "../src/app.js";
import supertest from "supertest";
import prisma from "../src/database.js";
import { faker } from "@faker-js/faker";
import { createNewRecommendation, giveRegisteredSongName } from "./factories/recommendationsFactory.js";

const agent = supertest(app);

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

describe("POST /recommendations/", () => {
    it("given valid recommendation data it should return 201", async () => {
        const body = createNewRecommendation();

        const result = await agent.post("/recommendations/").send(body);
        const status = result.status;

        expect(status).toEqual(201);
    });

    it("given invalid song name and valid youtube url it should return 422", async () => {
        const body = createNewRecommendation();
        body.name = "";

        const result = await agent.post("/recommendations/").send(body);
        const status = result.status;

        expect(status).toEqual(422);
    });

    it("given a registered song name and valid youtube url it should return 409", async () => {
        const registeredName = await giveRegisteredSongName();

        const body = createNewRecommendation();
        body.name = registeredName;
        
        const result = await agent.post("/recommendations/").send(body);
        const status = result.status;

        expect(status).toEqual(409);
    });
});


afterAll(async () => {
    await prisma.$disconnect();
});
