/// <reference types="Cypress" />

import nextTogo from "../pages/nextTogo";

describe("Countdown Timer", () => {
  const dayjs = require("dayjs");

  beforeEach(() => {
    cy.visit("/");
    cy.reload();
  });

  it("Should validate that timer is ticking down", () => {
    const timeToJump5S = dayjs().add(5, "s").toJSON();

    cy.intercept("GET", "v2/racing/next-races-category-group?*", {
      body: {
        category_race_map: {
          "161d9be2-e909-4326-8c2c-35ed71fb460b": {
            race_ids: ["2b32a47a-aa36-42a2-99ab-63fe3b0812c7"],
          },
        },
        race_summaries: {
          "2b32a47a-aa36-42a2-99ab-63fe3b0812c7": {
            race_id: "2b32a47a-aa36-42a2-99ab-63fe3b0812c7",
            race_number: 8,
            meeting_name: "Bathurst",
            category_id: "161d9be2-e909-4326-8c2c-35ed71fb460b",
            advertised_start: timeToJump5S,
          },
        },
      },
    }).as("nextRaceIn5s");
    cy.reload();
    cy.wait("@nextRaceIn5s").then(() => {
      nextTogo.timeToJump.should("have.text", "4s");
    });
  });

  it("Should validate that race time sign swaps to negative when expected jump time is exceeded", () => {
    const timeToJump1S = dayjs().add(1, "s").toJSON();

    cy.intercept("GET", "v2/racing/next-races-category-group?*", {
      body: {
        category_race_map: {
          "161d9be2-e909-4326-8c2c-35ed71fb460b": {
            race_ids: ["2b32a47a-aa36-42a2-99ab-63fe3b0812c7"],
          },
        },
        race_summaries: {
          "2b32a47a-aa36-42a2-99ab-63fe3b0812c7": {
            race_id: "2b32a47a-aa36-42a2-99ab-63fe3b0812c7",
            race_number: 8,
            meeting_name: "Bathurst",
            category_id: "161d9be2-e909-4326-8c2c-35ed71fb460b",
            advertised_start: timeToJump1S,
          },
        },
      },
    }).as("nextRaceIn1s");
    cy.reload();
    // Handle this deterministically through mocking race jump times
    cy.wait("@nextRaceIn1s").then(() => {
      // cy.wait(5000);
      nextTogo.timeToJump.should("contain", "-");
    });
  });

  it("Should validate that races do not display after 5 minutes past the jump", () => {
    // Handle this deterministically through mocking race jump times
    const timeToJump6m = dayjs().subtract(6, "m").toJSON();

    cy.intercept("GET", "v2/racing/next-races-category-group?*", {
      body: {
        category_race_map: {
          "161d9be2-e909-4326-8c2c-35ed71fb460b": {
            race_ids: ["2b32a47a-aa36-42a2-99ab-63fe3b0812c7"],
          },
        },
        race_summaries: {
          "2b32a47a-aa36-42a2-99ab-63fe3b0812c7": {
            race_id: "2b32a47a-aa36-42a2-99ab-63fe3b0812c7",
            race_number: 8,
            meeting_name: "Bathurst",
            category_id: "161d9be2-e909-4326-8c2c-35ed71fb460b",
            advertised_start: timeToJump6m,
          },
        },
      },
    }).as("nextRaceIn6m");
    cy.reload();

    cy.wait("@nextRaceIn6m").then(() => {
      nextTogo.raceTable.should("not.exist");
    });
  });
});
