import app from "../../src/app.js";
import supertest from "supertest";
import prisma from "../../src/database.js";
import { insertNewRecommendation, getRecommendationById } from "../factories/recommendationsFactory.js";
import { faker } from "@faker-js/faker";

const agent = supertest(app);

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("POST /recommendations/:id/downvote", () => {
    it("given a valid id for a recommendation with score greater than -5 it should downvote and return 200", async () => {
        const recommendation = await insertNewRecommendation();
        const maximumScore = 1000;
        const randomScore = Math.floor(Math.random()*(maximumScore)+1);
        await prisma.recommendation.update({
            where: {
                id: recommendation.id
            },
            data: {
                score: randomScore
            }
        });

        const votesBefore = randomScore;

        const result = await agent.post(`/recommendations/${recommendation.id}/downvote`);
        const status = result.status;

        const recAfter = await getRecommendationById(recommendation.id);
        const votesAfter = recAfter.score;

        expect(status).toEqual(200);
        expect(votesAfter).toEqual(votesBefore - 1);
    });

    it("given a valid id for a recommendation with score equals to -5 it should exclude the recommendation and return 200", async () => {
        const recommendation = await insertNewRecommendation();
        await prisma.recommendation.update({
            where: {
                id: recommendation.id
            },
            data: {
                score: -5
            }
        });

        const result = await agent.post(`/recommendations/${recommendation.id}/downvote`);
        const status = result.status;

        const checkExcluded = await prisma.recommendation.findUnique({
            where: {
                id: recommendation.id
            }
        });

        expect(status).toEqual(200);
        expect(checkExcluded).toEqual(null);
    });


    it("given an invalid id it should return 404", async () => {
        const id = -1;
        
        const result = await agent.post(`/recommendations/${id}/downvote`);
        const status = result.status;

        expect(status).toEqual(404);
    });
});


afterAll(async () => {
    await prisma.$disconnect();
});
