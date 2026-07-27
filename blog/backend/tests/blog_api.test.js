import mongoose from "mongoose";
import app from "../app.js";
import test, { after, describe, beforeEach, before } from "node:test";
import supertest from "supertest";
import { initialBlogs } from "./test_helper.js";
import assert from "node:assert";
import Blog from "../models/blog.js";

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});
const api = supertest(app);
describe("api", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-type", /application\/json/);
  });
  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, initialBlogs.length);
  });
  test("unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");
    const blog = response.body[0];
    assert(Object.keys(blog).includes("id"));
  });
  test("successfully creates a new blog post", async () => {
    const blogsAtStart = await Blog.find({});

    const newBlogEntry = {
      title: "Testing Express Applications",
      author: "Isabella Thomas",
      url: "https://example.com/testing-express",
      likes: 48,
    };

    const blog = new Blog(newBlogEntry);
    await blog.save();

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);
    console.log("number has increased by 1");
    const newBlogInDb = await Blog.findById(blog.id);
    assert.deepStrictEqual(newBlogInDb.toJSON(), blog.toJSON());
    console.log("document is same as sent");
  });

  test("if likes property is missing, the likes are set to 0", async () => {
    const blog = {
      title: "Testing Express Applications",
      author: "Isabella Thomas",
      url: "https://example.com/testing-express",
    };
    await api
      .post("/api/blogs")
      .send(blog)
      .expect(201)
      .expect("Content-type", /application\/json/);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0);
  });

  test("if the title or url properties are missing, backend responds with status code 400", async () => {
    const response = await api.post("/api/blogs").send({
      author: "Isabella Thomas",
    });
    assert.strictEqual(response.status, 400);
  });

  test("updating a blog using PUT changes its details", async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      title: "Updated Title",
      author: "Updated Author",
      url: "https://example.com/updated-url",
      likes: 99,
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-type", /application\/json/);

    assert.strictEqual(response.body.id, blogToUpdate.id);

    const blogInDb = await Blog.findById(blogToUpdate.id);
    assert.deepStrictEqual(blogInDb.toJSON(), {
      ...updatedBlog,
      id: blogToUpdate.id,
    });
  });

  test("a blog can be deleted", async () => {
    const blogsAtStart = await Blog.find({});
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    const deletedBlog = await Blog.findById(blogToDelete.id);
    assert.strictEqual(deletedBlog, null);
  });
});

after(async () => {
  await mongoose.connection.close();
});
