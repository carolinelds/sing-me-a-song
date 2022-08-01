import app from "../../src/app.js";
import supertest from "supertest";
import prisma from "../../src/database.js";
import { insertNewRecommendations } from "../factories/recommendationsFactory.js";
import { Recommendation } from "@prisma/client";
import { faker } from "@faker-js/faker";

const agent = supertest(app);

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("POST /recommendations/top/:amount", () => {
    it("given a valid amount and that more than 'amount' recommendations are registered it should return the top 'amount' recommendations sorted by decrescent scores", async () => {
        const n = parseInt(faker.random.numeric(2, { allowLeadingZeros: false }));
        await insertNewRecommendations(n);

        const amount = Math.floor(Math.random()*(n-1)+1);

        const result = await agent.get(`/recommendations/top/${amount}`);
        const recommendations : Recommendation[] = result.body;

        const randomIndex = Math.floor(Math.random()*(amount-1)+1);

        expect(recommendations[randomIndex].score).toBeGreaterThanOrEqual(recommendations[randomIndex + 1].score);
        expect(recommendations.length).toEqual(amount);
    });

    it("given a valid amount and that less than 'amount' recommendations are registered it should return all the recommendations sorted by decrescent scores", async () => {
        const n = parseInt(faker.random.numeric(2, { allowLeadingZeros: false }));
        await insertNewRecommendations(n);

        const randomMaximum = parseInt(faker.random.numeric(3, { allowLeadingZeros: false }));
        const amount = Math.floor(Math.random()*(randomMaximum - n + 1) + 1); 

        const result = await agent.get(`/recommendations/top/${amount}`);
        const recommendations : Recommendation[] = result.body;

        const randomIndex = Math.floor(Math.random()*(n-1)+1);

        expect(recommendations[randomIndex].score).toBeGreaterThanOrEqual(recommendations[randomIndex + 1].score);
        expect(recommendations.length).toEqual(n);
    });
    
    it("given a valid amount and that no recommendations are registered yet it should return an empty array", async () => {
        const amount = faker.random.numeric();
        const result = await agent.get(`/recommendations/top/${amount}`);
        const recommendations : Recommendation[] = result.body;

        expect(recommendations.length).toEqual(0);
    });
    

    it("given an invalid amount it should return status 500", async () => {
        const amount = faker.random.alpha;
        const result = await agent.get(`/recommendations/top/${amount}`);
        const status = result.status;
        expect(status).toEqual(500);
    });
});


afterAll(async () => {
    await prisma.$disconnect();
});
