import { describe, test } from "node:test";
import assert from "node:assert";
import list_helper from "../utils/list_helper.js";

describe("dummy", () => {
  test("returns one", () => {
    const blogs = [];
    const result = list_helper.dummy(blogs);
    assert.strictEqual(result, 1);
  });
});

