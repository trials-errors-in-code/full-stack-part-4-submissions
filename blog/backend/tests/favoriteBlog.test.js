import { describe, test } from "node:test";
import assert from "node:assert";
import list_helper from "../utils/list_helper.js";
import data from "../utils/data.js";

const mostLikeBlog = {
  title: "Building Secure Authentication Systems",
  author: "Ava White",
  url: "https://example.com/secure-authentication",
  likes: 112,
  id: "6a60dfb359e7bf0bb783b59f",
};

describe("favorite blog", () => {
  test("for blogList1 is the first blog with the maximum likes", () => {
    const result = list_helper.favoriteBlogs(data.blogsList1);
    assert.deepStrictEqual(result, mostLikeBlog);
  });
});
