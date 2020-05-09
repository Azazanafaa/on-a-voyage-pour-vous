const request = require("supertest");
const app = require("./app");

describe("testing the getAnalysis path", () => {
  test("It should response the GET method", done => {
    request(app)
      .get("/getTripData")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});