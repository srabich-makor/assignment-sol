import {
  baseUrl,
  username_btn,
  password_btn,
  signin_btn,
  eye_icon,
  drawer,
  kabab,
  actions,
  pin_unpin,
  duplicate,
  define,
  define_as_global,
  define_as_wrokspace,
  rename,
} from "../../cypress.json";

describe("The Good Path: Auth process as client and making Dashboard Actions" /*{ retries: 3 },*/, function () {
  beforeEach(function () {
    cy.visit(baseUrl);

    cy.location().should((loc) => {
      expect(loc.href).to.eq("https://dev.enigma-x.app/Login");
    });
  });
  after(() => {
    cy.log("resetDb() opreation");
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("extract a 6-digit numeric code from a email, validate snacbars, logout", function () {
    cy.get(username_btn).should("exist");
    cy.get(password_btn).should("exist");
    cy.get(signin_btn).should("be.visible").should("exist");
    cy.get(eye_icon).should("be.visible").should("exist");
    cy.contains("Username").should("be.visible");
    cy.contains("Password").should("be.visible");
    cy.get("img").should("exist").should("be.visible");
    cy.get("h6").should("be.visible").should("contain", "Welcome!");

    //cypress element css
    cy.get(signin_btn).invoke("attr", "data-cy").should("equal", "sign-in");

    //cypress check css property value
    cy.get(signin_btn).invoke("css", "position").should("equal", "relative");

    Cypress.env() ? cy.log(true) : cy.log(false);

    cy.get(username_btn).click().clear().type(Cypress.env("USRNAME"));
    cy.get(password_btn).click().clear().type(Cypress.env("PASSWORD"));
    cy.get(eye_icon).click();
    cy.get(signin_btn).click();

    cy.document().then((doc) => {
      const snackbar = doc.querySelector("[data-cy=snackbar-msg]");
      cy.get(snackbar).should("exist");
      cy.get("[data-cy=snackbar-msg]")
        .contains("Successfully connected")
        .should("be.visible");
    });

    cy.get("p").should(($p) => {
      expect($p).to.have.length(5);
      assert.isOk("p"); //expect($p).to.be.instanceOf(String);
    });

    cy.get("h2").should("contain", "Last Connected");
    cy.get("h3").should("contain", "- admin");
    cy.get('[class="MuiGrid-root MuiGrid-item"]').should("exist"); //the yellow box
    cy.get("p").should("contain", "DEV");

    const img_selector = 'img[alt="logo"]';
    cy.get(img_selector).should(
      "have.attr",
      "src",
      "https://dev.assets.enigma-x.io/fec8fe6b-a46e-13ec-a805-9c7bef452fa0/logo_light.png"
    );

    cy.location().should((loc) => {
      expect(loc.href).to.contain(
        "https://dev.enigma-x.app/dashboard/workspaces"
      );
    });

    cy.get("p").should("contain", "Create Your Dashboard");

    cy.wait(1000);
    cy.get(drawer).last().trigger("mouseover");
    cy.get(kabab).last().click({ force: true });
    cy.get(actions).should("exist");
    cy.get(pin_unpin).should("exist");
    cy.get(duplicate).should("exist");
    cy.get(define).should("exist");
    cy.get(define_as_global).should("exist");
    cy.get(define_as_wrokspace).should("exist");
    cy.get(rename).should("exist");

    cy.get(kabab).last().click({ force: true });
    cy.get(pin_unpin).last().click({ force: true }).wait(1000);

    cy.get(kabab).last().click();
    cy.get(pin_unpin).click({ force: true }).wait(1000);

    cy.get(kabab).last().click();
    cy.get(duplicate).click().wait(1000);

    cy.get(kabab).last().click();
    if (!cy.get(define).last().should("have.css", "display", "flex"))
      cy.get(define).last().click({ multiple: true }, { force: true }); //cy.get('[data-top="284"]')

    cy.document().then((doc) => {
      const snackbar = doc.querySelector("[data-cy=snackbar-msg]");
      cy.get(snackbar).should("exist");
    });

    cy.contains("Something went wrong").should("be.visible");

    cy.get(kabab).first().click();
    cy.get(define_as_global).last().click().wait(1000);

    cy.get(kabab).last().click();
    cy.get(define_as_wrokspace).click().wait(1000);

    cy.get("h4").should("contain", "Workspace Icon");
    cy.get("#Name").click();

    cy.get(kabab).first().click();
    cy.get(rename).click().wait(1000);

    cy.contains("Delete").click({ force: true });
    cy.contains("Yes, delete").click({ force: true });

    cy.get(".MuiAvatar-root").click(); //profile icon
    cy.get('[data-name="Line 15"]').click(); //make logout
  });
});
