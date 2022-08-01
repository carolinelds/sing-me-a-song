import app from "../../src/app.js";
import supertest from "supertest";
import prisma from "../../src/database.js";
import {
  insertNewRecommendation,
  giveRegisteredSongName,
} from "../factories/recommendationsFactory.js";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("POST /recommendations/:id", () => {
  it("given a valid id it should return the corresponding recommendation", async () => {
    const created = await insertNewRecommendation();
    const id = created.id;

    const result = await agent.get(`/recommendations/${id}`);
    const returnedId = result.body.id;

    expect(returnedId).toEqual(id);
  });

  it("given an invalid id it should return status 404", async () => {
    const count = await prisma.recommendation.count();
    const id = count + 1;

    const result = await agent.get(`/recommendations/${id}`);
    const status = result.status;

    expect(status).toEqual(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
