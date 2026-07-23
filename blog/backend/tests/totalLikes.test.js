import { describe, test } from "node:test";
import assert from "node:assert";
import list_helper from "../utils/list_helper.js";

const blogs = [
  {
    title: "Building Secure Authentication Systems",
    author: "Ava White",
    url: "https://example.com/secure-authentication",
    likes: 112,
    id: "6a60dfb359e7bf0bb783b59f",
  },
];

describe("total likes", () => {
  test("when number of blogs in list is 1, equals the likes of that blog", () => {
    let result = list_helper.totalLikes(blogs);
    assert.strictEqual(result, blogs[0].likes);
  });
});
