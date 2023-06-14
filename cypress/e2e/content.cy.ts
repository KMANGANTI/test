/// <reference types="Cypress" />
import { RACING_CATEGORIES } from "../config/constants";
import nextTogo from "../pages/nextTogo";

describe("Page Content", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Should correctly display page title", () => {
    // Next To Go Races
    nextTogo.pageTitle.should("have.text", "Next To Go Races");
  });

  it("Should display expected values for race row contents", () => {
    // Race number, venue name, time to jump
    nextTogo.raceTable.should("have.length", 5).each(($el) => {
      cy.wrap($el).should("not.be.empty");
    });
  });

  it("Should display race categories", () => {
    //Thoroughbred, Greyhound, Harness
    nextTogo.labelAllCategories.should("have.length", 3);

    nextTogo.labelAllCategories.then(($el) => {
      for (let i = 0; i < RACING_CATEGORIES.length; i++) {
        cy.wrap($el).should("contain", RACING_CATEGORIES[i].name);
      }
    });
  });
});
