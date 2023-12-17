import axios from "axios";

import {BASE_URL} from "../../utils/config";

const searchUser = async (username, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(
    `${BASE_URL}/search?username=${username}`,
    config
  );
  return response.data;
};

const getUser = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${BASE_URL}/user/${id}`, config);
  return response.data;
};

const updateUser = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(`${BASE_URL}/user`, data, config);
  return response.data;
};

const follow = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(`${BASE_URL}/user/${id}/follow`, config);
  return response.data;
};

const unfollow = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(`${BASE_URL}/user/${id}/unfollow`, config);
  return response.data;
};

const suggestionsUser = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${BASE_URL}/suggestionsUser`, config);
  return response.data;
};

const userService = {
  searchUser,
  getUser,
  updateUser,
  follow,
  unfollow,
  suggestionsUser,
};

export default userService;
