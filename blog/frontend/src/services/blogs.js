import axios from "axios";
const blogUrl = "/api/blogs";
let token = null;

const setToken = (newtoken) => {
  token = `Bearer ${newtoken}`;
};

const getAll = async () => {
  const response = await axios.get(blogUrl);
  return response.data;
};
const createBlog = async (pNewBlog) => {
  const config = { headers: { Authorization: token } };

  await axios.post(blogUrl, pNewBlog, config);
};

export default { getAll, setToken, createBlog };
