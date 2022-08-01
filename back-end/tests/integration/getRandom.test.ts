import app from "../../src/app.js";
import supertest from "supertest";
import prisma from "../../src/database.js";
import { insertNewRecommendations } from "../factories/recommendationsFactory.js";
import { faker } from "@faker-js/faker";

const agent = supertest(app);

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("POST /recommendations/random", () => {    
    it("given that there is one or more recommendations registered it should return a recommendation", async () => {
        const n = parseInt(faker.random.numeric(1, { bannedDigits: ['0'] }));
        await insertNewRecommendations(n);

        const result = await agent.get(`/recommendations/random`);

        expect(typeof result.body.id).toEqual("number");
        expect(typeof result.body.name).toEqual("string");
        expect(typeof result.body.score).toEqual("number");
        expect(typeof result.body.youtubeLink).toEqual("string");
    });
    

    it("given that there is no recommendation registered yet it should return status 404", async () => {
        const result = await agent.get(`/recommendations/random`);
        const status = result.status;
        expect(status).toEqual(404);
    });
});


afterAll(async () => {
    await prisma.$disconnect();
});
