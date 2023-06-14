/// <reference types="Cypress" />
import nextTogo from "../pages/nextTogo";

describe("Page Content", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Negative Scenarios - Network Error", () => {
    // cy.reload();
    cy.intercept("GET", "v2/racing/next-races-category-group?*", {
      forceNetworkError: true,
    }).as("errorCatch");
    cy.wait("@errorCatch").then(() => {
      nextTogo.pageTitle.should(
        "have.text",
        "Service Not Available. Please contact support@entain.com.au for enquiries"
      );
    });
  });
});
