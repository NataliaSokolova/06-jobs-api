import { app } from '../app.js';
import request from 'supertest';
import { seedDB } from '../utils/seed_db.js';
import { faker } from '@faker-js/faker';
import User from '../models/User.js';


describe("Tests for registration and logon", () => {
  let csrfToken;
  let csrfCookie;
  let user;
  let password;

  beforeAll(async () => {
    const { testUser } = await seedDB();
    user = testUser;
  });

  it("should get the registration page", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: user.name,
        email: user.email,
        password: user.password,
      })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.text).toContain("Enter your name");

    // Extract CSRF token from response body
    const textNoLineEnd = res.text.replaceAll("\n", "");
    const csrfTokenMatch = /_csrf" value="(.*?)"/.exec(textNoLineEnd);
    expect(csrfTokenMatch).not.toBeNull();
    csrfToken = csrfTokenMatch[1];

    // Check for cookies and csrf token cookie
    const cookies = res.headers["set-cookie"];
    csrfCookie = cookies.find((cookie) => cookie.startsWith("csrfToken"));
    expect(csrfCookie).not.toBeUndefined();
  });

  // it("should register the user", async () => {
  //   password = faker.internet.password();

  //   const dataToPost = {
  //     name: user.name,
  //     email: user.email,
  //     password,
  //     password1: password,
  //     _csrf: csrfToken,
  //   };

  //   const res = await request(app)
  //     .post("/session/register")
  //     .set("Cookie", csrfCookie)
  //     .set("content-type", "application/x-www-form-urlencoded")
  //     .send(dataToPost);

  //   expect(res.status).toBe(200);
  //   expect(res.text).toContain("Jobs List");

  //   // Check if the new user is saved in the database
  //   const newUser = await User.findOne({ email: user.email });
  //   expect(newUser).not.toBeNull();
  // });
});
