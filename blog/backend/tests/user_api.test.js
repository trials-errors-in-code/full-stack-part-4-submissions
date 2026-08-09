import supertest from "supertest";
import test, { after, beforeEach, describe } from "node:test";
import User from "../models/user.js";
import app from "../app.js";
import mongoose from "mongoose";
import assert from "node:assert";

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

describe("User creation", () => {
  test("fails with status code 400 for username and password of length less than 3 characters", async () => {
    const user = {
      username: "ab",
      name: "user",
      password: "password",
    };
    const result = await api.post("/api/users").send(user);
    assert.strictEqual(result.status, 400);
    assert.strictEqual(
      result.body.error,
      "Username and password should be at least 3 characters long.",
    );
  });
});
after(async () => {
  await mongoose.connection.close();
});
