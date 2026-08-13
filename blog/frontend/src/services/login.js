import axios from "axios";

const login = async (data) => {
  try {
    const response = await axios.post("api/login", data);
    return response.data;
  } catch (error) {
    if (error.response.data) {
      console.log(error.response.data.error);
      throw error.response.data;
    }
    console.log(error);
    throw error;
  }
};
export default { login };
