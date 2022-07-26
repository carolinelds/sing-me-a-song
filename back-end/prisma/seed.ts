import prisma from "./../src/database.js";
import { faker } from "@faker-js/faker";

async function main(){
    const name = faker.music.songName();
    const youtubeLink = `https://www.youtube.com/${faker.random.alphaNumeric()}`;

    const newRecommendation = {
        name,
        youtubeLink
    };

    await prisma.recommendation.create({
        data: newRecommendation
    });
};

try {
    main();
} catch(e) {
    console.log(e);
    process.exit(1);
} finally {
    async () => await prisma.$disconnect();
};