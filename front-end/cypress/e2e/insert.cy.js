/// <reference types="cypress" />
import { faker } from "@faker-js/faker";

describe("insert recommendation suit test", () => {
  it(`given valid recommendation data
        when the insert button is clicked
        it should insert new music recommendation and clear input data`, async () => {
    const validRecommendation = {
      name: faker.music.songName(),
      youtubeLink: `www.youtube.com/${faker.random.alphaNumeric()}`,
    };

    cy.visit("http://localhost:3000");

    cy.get("#name-input").type(validRecommendation.name);
    cy.get("#link-input").type(validRecommendation.youtubeLink);

    cy.intercept("POST","/recommendations").as("insertRecommendation");

    cy.get("#insert-song-button").click();
    cy.wait("@insertRecommendation");

    cy.contains(validRecommendation.name).should("be.visible");
    cy.get("#name-input").should("have.length", 1);
    cy.get("#link-input").should("have.length", 1);
  });

  it(`given valid song name and invalid link
        when the insert button is clicked
        it should not insert new music recommendation and should clear input data`, async () => {
    const invalidRecommendation = {
      name: faker.music.songName(),
      youtubeLink: "",
    };

    cy.visit("http://localhost:3000");

    cy.get("#name-input").type(invalidRecommendation.name);
    cy.get("#link-input").type(invalidRecommendation.youtubeLink);

    cy.intercept("POST","/recommendations").as("insertRecommendation");

    cy.get("#insert-song-button").click();
    cy.wait("@insertRecommendation");

    cy.contains(invalidRecommendation.name).should("not.exist");
    cy.get("#name-input").should("have.length", 1);
    cy.get("#link-input").should("have.length", 1);
  });

  it(`given invalid song name and valid link
        when the insert button is clicked
        it should not insert new music recommendation and should clear input data`, async () => {
    const invalidRecommendation = {
      youtubeLink: `www.youtube.com/${faker.random.alphaNumeric()}`,
    };

    cy.visit("http://localhost:3000");

    cy.get("#name-input").type(invalidRecommendation.name);
    cy.get("#link-input").type(invalidRecommendation.youtubeLink);

    cy.intercept("POST","/recommendations").as("insertRecommendation");

    cy.get("#insert-song-button").click();
    cy.wait("@insertRecommendation");

    cy.contains(invalidRecommendation.name).should("not.exist");
    cy.get("#name-input").should("have.length", 1);
    cy.get("#link-input").should("have.length", 1);
  });

});
