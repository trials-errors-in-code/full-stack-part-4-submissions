import mongoose from "mongoose";
import app from "../app.js";
import test, { after, describe, beforeEach, before } from "node:test";
import supertest from "supertest";
import { initialBlogs } from "./test_helper.js";
import assert from "node:assert";
import Blog from "../models/blog.js";
import User from "../models/user.js";

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  await api
    .post("/api/users")
    .send({ username: "user1", name: "User One", password: "sekret" });
  await api
    .post("/api/users")
    .send({ username: "user2", name: "User Two", password: "sekret" });

  const user1 = await User.findOne({ username: "user1" });
  user1.id = user1._id.toString();

  const user2 = await User.findOne({ username: "user2" });
  user2.id = user2._id.toString();

  const loginUser1 = await api
    .post("/api/login")
    .send({ username: "user1", password: "sekret" });
  const loginUser2 = await api
    .post("/api/login")
    .send({ username: "user2", password: "sekret" });
  const token1 = loginUser1.body.token;
  const token2 = loginUser2.body.token;

  for (let i = 0; i < initialBlogs.length; i++) {
    const blog = { ...initialBlogs[i] };
    const token = i % 2 === 0 ? token1 : token2;
    const userId = i % 2 === 0 ? user1.id : user2.id;

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...blog, user: userId });
  }
});

describe("api", () => {
  test.only("blogs are returned as json", async () => {
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

  //TODO make this test also go through api post
  test.only("successfully creates a new blog post", async () => {
    const blogsAtStart = await Blog.find({});

    const blog = {
      title: "Unique Title",
      author: "Isabella Thomas",
      url: "https://example.com/testing-express",
      likes: 48,
    };
    const loggedInUser = await api.post("/api/login").send({
      username: "user1",
      password: "sekret",
    });
    const token = loggedInUser.body.token;

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog)
      .expect(201);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);
    const findBlogInDb = await Blog.find({ title: blog.title });
    const newBlogInDb = findBlogInDb[0];
    console.log(blog);
    console.log(newBlogInDb);
    assert.deepStrictEqual(
      {
        title: newBlogInDb.title,
        author: newBlogInDb.author,
        url: newBlogInDb.url,
        likes: newBlogInDb.likes,
      },
      blog,
    );
  });

  test("if likes property is missing, the likes are set to 0", async () => {
    const loggedInUser = await api.post("/api/login").send({
      username: "user1",
      password: "sekret",
    });
    const token = loggedInUser.body.token;
    const blog = {
      title: "Testing Express Applications",
      author: "Isabella Thomas",
      url: "https://example.com/testing-express",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect("Content-type", /application\/json/);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0);
  });

  test("if the title or url properties are missing, backend responds with status code 400", async () => {
    const loggedInUser = await api.post("/api/login").send({
      username: "user1",
      password: "sekret",
    });
    const token = loggedInUser.body.token;
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        author: "Isabella Thomas",
      });
    assert.strictEqual(response.status, 400);
  });

  //!this uses put
  test("updating a blog using PUT changes its details", async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      title: "Updated Title",
      author: "Updated Author",
      url: "https://example.com/updated-url",
      likes: 99,
      user: [],
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-type", /application\/json/);

    assert.strictEqual(response.body.id, blogToUpdate.id);

    const blogInDb = await Blog.findById(blogToUpdate.id);
    // compare relevant fields (user may be auto-assigned by POST)
    assert.strictEqual(blogInDb.title, updatedBlog.title);
    assert.strictEqual(blogInDb.author, updatedBlog.author);
    assert.strictEqual(blogInDb.url, updatedBlog.url);
    assert.strictEqual(blogInDb.likes, updatedBlog.likes);
  });
  //!delete
  test("a blog can be deleted", async () => {
    const blogsAtStart = await Blog.find({});
    const blogToDelete = blogsAtStart[0];
    const getUserId = blogToDelete.user.toString();

    const user = await User.findById(getUserId);
    const loggedInUser = await api.post("/api/login").send({
      username: user.username,
      password: "sekret",
    });
    const token = loggedInUser.body.token;

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    const deletedBlog = await Blog.findById(blogToDelete.id);
    assert.strictEqual(deletedBlog, null);
  });
});

after(async () => {
  await mongoose.connection.close();
});
