import app from "../../src/app.js";
import supertest from "supertest";
import prisma from "../../src/database.js";
import { createNewRecommendation, giveRegisteredSongName } from "../factories/recommendationsFactory.js";

const agent = supertest(app);

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("POST /recommendations/", () => {
    it("given valid recommendation data it should insert new recommendation and return 201", async () => {
        const recsBefore = await prisma.recommendation.findMany();

        const body = createNewRecommendation();

        const result = await agent.post("/recommendations/").send(body);
        const status = result.status;

        const recsAfter = await prisma.recommendation.findMany();

        expect(status).toEqual(201);
        expect(recsAfter.length).toBeGreaterThan(recsBefore.length);
    });

    it("given invalid song name and valid youtube url it should return 422", async () => {
        const body = createNewRecommendation();
        body.name = "";

        const result = await agent.post("/recommendations/").send(body);
        const status = result.status;

        expect(status).toEqual(422);
    });

    it("given valid song name and invalid youtube url it should return 422", async () => {
        const body = createNewRecommendation();
        body.youtubeLink = "";

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
