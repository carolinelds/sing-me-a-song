import prisma from "../../src/database.js";
import { jest } from "@jest/globals";
import { recommendationService } from "./../../src/services/recommendationsService.js";
import { recommendationRepository } from "./../../src/repositories/recommendationRepository.js";
import { createNewRecommendation, getRecommendationById, giveRegisteredSongName, insertNewRecommendation } from "./../factories/recommendationsFactory.js";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe("recommendations services unit test suite", () => {
    it(`given a valid recommendation data 
        when INSERT function is called 
        then it should create a new recommendation`,
        async () => {
            jest.spyOn(recommendationRepository, "create").mockImplementationOnce(async (): Promise<any> => { });

            const createData = await createNewRecommendation();
            await recommendationService.insert(createData);

            expect(recommendationRepository.create).toBeCalled();
        });

    it(`given a registered song name and valid youtube url 
        when INSERT funcion is called 
        then it should throw a conflict error`,
        async () => {
            jest.spyOn(recommendationRepository, "findByName").mockImplementation((): any => []);

            const registeredName = await giveRegisteredSongName();
            let createData = await createNewRecommendation();
            createData.name = registeredName;

            const promise = recommendationService.insert(createData);

            expect(promise).rejects.toEqual({
                message: "Recommendations names must be unique",
                type: "conflict"
            });
        });
});

afterAll(async () => {
    await prisma.$disconnect();
});