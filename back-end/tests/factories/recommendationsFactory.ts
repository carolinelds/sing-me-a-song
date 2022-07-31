import { faker } from "@faker-js/faker";
import { Recommendation } from "@prisma/client";
import prisma from "./../../src/database.js";

export async function createNewRecommendation(){

    let name : string = "";
    let nameIsRepeated : boolean = true;
    while (nameIsRepeated){
        name = faker.music.songName();
        let checkName = await prisma.recommendation.findUnique({
            where: {
                name
            }
        });
        if (checkName === null) nameIsRepeated = false;
    };

    const youtubeLink = `www.youtube.com/${faker.random.alphaNumeric()}`;

    const newRecommendation = {
        name,
        youtubeLink
    };

    return newRecommendation;
};

export async function insertNewRecommendation(){
    let newRec = await createNewRecommendation();
    let created = await prisma.recommendation.create({
        data: newRec
    });

    return created;
};

export async function insertNewRecommendations(n: number){
    for (let i = 0; i < n; i++){
        await insertNewRecommendation();
    };
};

export async function giveRegisteredSongName(){
    const originalRec = await createNewRecommendation();
    const name = originalRec.name;
    await prisma.recommendation.create({
        data: originalRec
    });

    return name;
};

export async function getRecommendationById(id: number){
    const recommendation = await prisma.recommendation.findUnique({
        where: {
            id
        }
    });
    
    return recommendation;
};