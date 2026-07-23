import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/blogs`)
      .then((res) => res.data)
      .then((data) => setBlogs(data))
      .catch((error) => console.log(error.message));
  }, []);
  if (blogs.length === 0) {
    return null;
  }
  return (
    <>
      <div className="AI-app-shell">
        <h2>List of blogs</h2>
        <div className="BlogList AI-blog-list">
          {blogs.map((blog) => (
            <div className="AI-blog-card">
              <button className="title AI-title"><a href={blog.url}><h4>{blog.title}</h4></a></button>
              <div className="details AI-details"><h5>by {blog.author}</h5><span>liked by {blog.likes}</span></div>
            </div>
          ))}
        </div>
        <div className="AI-note">this is great code</div>
      </div>
    </>
  );
}
export default App;
