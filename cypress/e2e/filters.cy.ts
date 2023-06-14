/// <reference types="Cypress" />
import {
  CATEGORY_ID_GREYHOUND,
  CATEGORY_ID_HARNESS,
  CATEGORY_ID_THOROUGHBRED,
  RACING_CATEGORIES,
} from "../config/constants";
import nextTogo from "../pages/nextTogo";

describe("Category Filters", () => {
  let [cat1, cat2, cat3] = RACING_CATEGORIES;

  beforeEach(() => {
    cy.visit("/");
    cy.intercept("GET", "v2/racing/next-races-category-group?*").as(
      "nextRaces"
    );
  });

  it("Should validate that all checkboxes are checked by default", () => {
    nextTogo.checkboxAllCategories
      .should("have.value", "on")
      .and("have.length", 3);
  });

  it("Should validate that checkboxes filter content appropriate", () => {
    //Check for Thoroughbred filter

    cy.wait("@nextRaces").then((xhr) => {
      let raceListCat1 =
        xhr.response.body.category_race_map[cat1.categoryId].race_ids;

      let raceListCat2 =
        xhr.response.body.category_race_map[cat2.categoryId].race_ids;

      let raceListCat3 =
        xhr.response.body.category_race_map[cat3.categoryId].race_ids;

      //Thoroughbred
      nextTogo.getCategoryCheckbox(CATEGORY_ID_GREYHOUND).click();
      nextTogo.getCategoryCheckbox(CATEGORY_ID_HARNESS).click();
      //Verify List is correct
      nextTogo.raceTable.each(($el, index) => {
        cy.wrap($el.children(".race-name").children(".race-number")).should(
          "have.text",
          `R${
            xhr.response.body.race_summaries[raceListCat1[index]].race_number
          }`
        );

        cy.wrap($el.children(".race-name").children("p")).should(
          "have.text",
          xhr.response.body.race_summaries[raceListCat1[index]].meeting_name
        );

        cy.wrap($el.children("p")).should("not.be.empty");
      });

      //Greyhound
      cy.reload();
      nextTogo.getCategoryCheckbox(CATEGORY_ID_THOROUGHBRED).click();
      nextTogo.getCategoryCheckbox(CATEGORY_ID_HARNESS).click();
      //Verify List is correct
      nextTogo.raceTable.each(($el, index) => {
        cy.wrap($el.children(".race-name").children(".race-number")).should(
          "have.text",
          `R${
            xhr.response.body.race_summaries[raceListCat2[index]].race_number
          }`
        );

        cy.wrap($el.children(".race-name").children("p")).should(
          "have.text",
          xhr.response.body.race_summaries[raceListCat2[index]].meeting_name
        );
        cy.wrap($el.children("p")).should("not.be.empty");
      });

      //Harness
      cy.reload();
      nextTogo.getCategoryCheckbox(CATEGORY_ID_THOROUGHBRED).click();
      nextTogo.getCategoryCheckbox(CATEGORY_ID_GREYHOUND).click();
      //Verify List is correct
      nextTogo.raceTable.each(($el, index) => {
        cy.wrap($el.children(".race-name").children(".race-number")).should(
          "have.text",
          `R${
            xhr.response.body.race_summaries[raceListCat3[index]].race_number
          }`
        );

        cy.wrap($el.children(".race-name").children("p")).should(
          "have.text",
          xhr.response.body.race_summaries[raceListCat3[index]].meeting_name
        );
        cy.wrap($el.children("p")).should("not.be.empty");
      });
    });
  });

  it("Should validate that unchecking all checkboxes re-enables all", () => {
    cy.reload();
    nextTogo.getCategoryCheckbox(CATEGORY_ID_THOROUGHBRED).click();
    nextTogo.getCategoryCheckbox(CATEGORY_ID_GREYHOUND).click();
    nextTogo.getCategoryCheckbox(CATEGORY_ID_HARNESS).click();
    nextTogo.checkboxAllCategories.should("have.value", "on");
  });
});
