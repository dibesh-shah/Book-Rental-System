import axios from "axios";

const API_BASE_URL = "https://bookrental-production.up.railway.app";

const getToken = () => {
  return localStorage.getItem("bearerAuth");
};

export const fetchAuthors = async () => {
  const token = getToken();
  const response = await axios.get(`${API_BASE_URL}/author`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
