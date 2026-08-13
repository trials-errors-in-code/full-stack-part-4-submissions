import { useState, useEffect } from "react";
import "./App.css";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import CreateBlog from "./components/CreateBlog";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const getBlogs = () => {
    blogService.getAll().then((data) => setBlogs(data));
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("BlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      getBlogs();
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      if (user) {
        window.localStorage.setItem("BlogAppUser", JSON.stringify(user));
        blogService.setToken(user.token);
        setUser(user);
        getBlogs();
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      if (!error.error) {
        setError(error.message);
      } else {
        setError(error.error);
        console.log("wrong credentials");
      }
    }
  };

  const loginForm = () => {
    return (
      <>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username{" "}
              <input
                autoComplete="true"
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password{" "}
              <input
                autoComplete="true"
                type="text"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
      </>
    );
  };

  // useEffect(() => {
  //   blogService.getAll().then((data) => setBlogs(data));
  // }, []);

  const handleLogout = () => {
    setUser("null");
    window.localStorage.removeItem("BlogAppUser");
    sessionStorage.clear();

    window.location.reload();
  };
  const logoutButton = () => {
    return (
      <>
        <button onClick={handleLogout}>Logout</button>
      </>
    );
  };
  return (
    <>
      <div className="AI-app-shell">
        {error && (
          <>
            <div className="AI-error">{error}</div>
          </>
        )}
        {notification && (
          <>
            <div className="notification">{notification}</div>
          </>
        )}
        <div style={{ fontWeight: "bolder", margin: "5px 0px" }}>
          the get blogs api endpoint works irrespective of user login or token
          timeout
        </div>

        {!user && loginForm()}
        {user && logoutButton()}
        {user && (
          <CreateBlog setError={setError} setNotifcation={setNotification} />
        )}

        {user && blogs.length !== 0 ? (
          <>
            <p style={{ border: "2px dashed black", padding: "10px" }}>
              {user.name} logged in
            </p>

            <h2 className="list-heading">List of blogs</h2>
            <div className="BlogList AI-blog-list">
              {blogs.map((blog) => (
                <Blog key={blog.id} blog={blog} />
              ))}
            </div>
            <div className="AI-note">this is great code</div>
          </>
        ) : null}
      </div>
    </>
  );
}
export default App;
