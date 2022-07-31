import app from "../../src/app.js";
import supertest from "supertest";
import prisma from "../../src/database.js";
import { insertNewRecommendation, getRecommendationById } from "../factories/recommendationsFactory.js";

const agent = supertest(app);

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("POST /recommendations/:id/upvote", () => {
    it("given a valid id it should upvote and return status 200", async () => {
        const recommendation = await insertNewRecommendation();
        const votesBefore = recommendation.score;

        const result = await agent.post(`/recommendations/${recommendation.id}/upvote`);
        const status = result.status;

        const recAfter = await getRecommendationById(recommendation.id);
        const votesAfter = recAfter.score;

        expect(status).toEqual(200);
        expect(votesAfter).toEqual(votesBefore + 1);
    });

    it("given an invalid id it should return status 404", async () => {
        const id = -1;
        
        const result = await agent.post(`/recommendations/${id}/upvote`);
        const status = result.status;

        expect(status).toEqual(404);
    });
});


afterAll(async () => {
    await prisma.$disconnect();
});
