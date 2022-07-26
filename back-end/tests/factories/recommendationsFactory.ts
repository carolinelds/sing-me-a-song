import { faker } from "@faker-js/faker";
import prisma from "./../../src/database.js";

export function createNewRecommendation(){

    const name = faker.music.songName();
    const youtubeLink = `www.youtube.com/${faker.random.alphaNumeric()}`;

    const newRecommendation = {
        name,
        youtubeLink
    };

    return newRecommendation;
};

export async function giveRegisteredSongName(){
    const originalRec = createNewRecommendation();
    const name = originalRec.name;
    await prisma.recommendation.create({
        data: originalRec
    });

    return name;
};