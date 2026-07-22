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
      <div className="BlogList">
        {blogs.map((blog) => (
          <div>
            <button className="title"><a href={blog.url}><h4>{blog.title}</h4></a></button>
            <div className="details"><h5>by {blog.author}</h5>{" "}{" "}liked by {blog.likes}</div>
          </div>
        ))}
      </div>
      "this is great code"
    </>
  );
}
export default App;
