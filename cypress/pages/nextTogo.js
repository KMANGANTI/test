class nextTogo {
  get pageTitle() {
    return cy.get('[data-testid="page-title"]');
  }
  get raceTable() {
    return cy.get(".item");
  }
  get labelAllCategories() {
    return cy.get('[data-testid="category-filter-label"]');
  }
  get timeToJump() {
    return cy.get(".item > p");
  }
  get checkboxAllCategories() {
    return cy.get('[data-testid="category-filter-checkbox"]');
  }
  getCategoryCheckbox(categoryId) {
    return cy.get(`[data-testid="category-filter-${categoryId}"] > input`);
  }
}

export default new nextTogo();
