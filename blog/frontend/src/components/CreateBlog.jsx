import { useState } from "react";
import blogService from "../services/blogs";

const CreateBlog = ({ setError, setNotifcation }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
    likes: null,
  });
  const handleBlogCreate = async () => {
    try {
      await blogService.createBlog(newBlog);
    } catch (error) {
      console.log("error occurred:\n", error.message);
      setError(JSON.stringify(error.message));
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
    setNotifcation(
      `title: ${newBlog.title}, author: ${newBlog.author} created`,
    );
    setNewBlog({
      title: "",
      author: "",
      url: "",
      likes: null,
    });

    setTimeout(() => {
      setNotifcation(null);
    }, 5000);
  };

  return (
    <form
      className="create-blog-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleBlogCreate(e);
      }}
    >
      <label>
        title
        <input
          type="text"
          value={newBlog.title}
          onChange={(e) => {
            setNewBlog({ ...newBlog, title: e.target.value });
          }}
        />
      </label>
      <label>
        author
        <input
          type="text"
          value={newBlog.author}
          onChange={(e) => {
            setNewBlog({ ...newBlog, author: e.target.value });
          }}
        />
      </label>
      <label>
        url
        <input
          type="text"
          value={newBlog.url}
          onChange={(e) => {
            setNewBlog({ ...newBlog, url: e.target.value });
          }}
        />
      </label>
      <button type="submit">Create Blog</button>
    </form>
  );
};

export default CreateBlog;
