import prisma from "../../src/database.js";
import { jest } from "@jest/globals";
import { recommendationService } from "./../../src/services/recommendationsService.js";
import { recommendationRepository } from "./../../src/repositories/recommendationRepository.js";
import { createNewRecommendation, giveRegisteredSongName, insertNewRecommendation, insertNewRecommendations } from "./../factories/recommendationsFactory.js";

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

    it(`given a valid id
        when UPVOTE function is called
        then it should find the corresponding recommendation and increment its score`,
        async () => {
            jest.spyOn(recommendationRepository, "find").mockImplementation((): any => []);
            jest.spyOn(recommendationRepository, "updateScore").mockImplementation((): any => []);

            const recommendation = await insertNewRecommendation();

            await recommendationService.upvote(recommendation.id);

            expect(recommendationRepository.find).toBeCalled();
            expect(recommendationRepository.updateScore).toBeCalled();
        });

    it(`given an invalid id
        when UPVOTE function is called
        then it should throw a not found error`,
        async () => {
            const id = -1;

            const promise = recommendationService.upvote(id);

            expect(promise).rejects.toEqual({
                type: "not_found",
                message: ""
            });
        });

    it(`given a valid id from a recommendation whose score is greater than -5
        when DOWNVOTE function is called 
        then it should get the corresponding recommendation and decrement its score`,
        async () => {
            jest.spyOn(recommendationRepository, "find").mockImplementation((): any => []);
            jest.spyOn(recommendationRepository, "updateScore").mockImplementation((): any => []);

            const recommendation = await insertNewRecommendation();

            await recommendationService.downvote(recommendation.id);

            expect(recommendationRepository.find).toBeCalled();
            expect(recommendationRepository.updateScore).toBeCalled();
        });

    it(`given a valid id from a recommendation whose score equals to -5
        when DOWNVOTE function is called 
        then it should get the corresponding recommendation and decrement its score and remove this recommendation`,
        async () => {
            jest.spyOn(recommendationRepository, "find").mockImplementation((): any => recommendation);
            jest.spyOn(recommendationRepository, "updateScore").mockImplementation((): any => { return { ...recommendation, score: -6 } });
            jest.spyOn(recommendationRepository, "remove").mockImplementation((): any => { });

            const create = await createNewRecommendation();
            const recommendation = { ...create, id: 1, score: -5 };

            await recommendationService.downvote(recommendation.id);

            expect(recommendationRepository.find).toBeCalled();
            expect(recommendationRepository.updateScore).toBeCalled();
            expect(recommendationRepository.remove).toBeCalled();
        });


    it(`given an invalid id
    when DOWNVOTE function is called 
    then it should throw a not found error`,
        async () => {
            const id = -1;

            const promise = recommendationService.downvote(id);

            expect(promise).rejects.toEqual({
                type: "not_found",
                message: ""
            });
        });

    it(`when GET function is called
        then it should return recommendations through findAll function from repository`,
        async () => {
            jest.spyOn(recommendationRepository, "findAll").mockImplementation((): any => []);

            await recommendationService.get();

            expect(recommendationRepository.findAll).toBeCalled();
        });

    it(`given a valid id
        when GETBYIDORFAIL function is called
        then it should return the corresponding recommendation`,
        async () => {
            jest.spyOn(recommendationRepository, "find").mockImplementation((): any => []);

            const recommendation = await insertNewRecommendation();

            await recommendationService.getById(recommendation.id);

            expect(recommendationRepository.find).toBeCalled();
        });

    it(`given an invalid id
        when GETBYIDORFAIL function is called
        then it should throw a not found error`,
        async () => {
            const id = -1;

            const promise = recommendationService.downvote(id);

            expect(promise).rejects.toEqual({
                type: "not_found",
                message: ""
            });
        });
});

afterAll(async () => {
    await prisma.$disconnect();
});