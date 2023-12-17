import axios from "axios";

import {BASE_URL} from "../../utils/config";

const createComment = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${BASE_URL}/comment`, data, config);
  return response.data;
};

const updateComment = async (id, data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(`${BASE_URL}/comment/${id}`, data, config);
  return response.data;
};

const likeComment = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(`${BASE_URL}/comment/${id}/like`, config);
  return response.data;
};

const unLikeComment = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(
    `${BASE_URL}/comment/${id}/unlike`,
    config
  );
  return response.data;
};

const deleteComment = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${BASE_URL}/comment/${id}`, config);
  return response.data;
};

const commentService = {
  createComment,
  updateComment,
  likeComment,
  unLikeComment,
  deleteComment,
};

export default commentService;
