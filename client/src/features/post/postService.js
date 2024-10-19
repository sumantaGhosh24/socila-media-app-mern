import axios from "axios";

import {BASE_URL} from "../../utils/config";

const createPost = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${BASE_URL}/posts`, data, config);
  return response.data;
};

const getPosts = async (search, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let limit = 8;
  let value = search ? search : `?page=${1}`;
  const response = await axios.get(
    `${BASE_URL}/posts${value}&limit=${limit}`,
    config
  );
  return response.data;
};

const getPost = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${BASE_URL}/post/${id}`, config);
  return response.data;
};

const deletePost = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${BASE_URL}/post/${id}`, config);
  return response.data;
};

const likePost = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(`${BASE_URL}/post/like/${id}`, {}, config);
  return response.data;
};

const unLikePost = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(
    `${BASE_URL}/post/${id}/unlike`,
    {},
    config
  );
  return response.data;
};

const getUserPosts = async (id, limit, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let pLimit = limit ? limit : 9;
  const response = await axios.get(
    `${BASE_URL}/user_posts/${id}?limit=${pLimit}`,
    config
  );
  return response.data;
};

const getPostsDiscover = async (search, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const limit = 8;
  let value = search ? search : `?page=${1}`;
  const response = await axios.get(
    `${BASE_URL}/post_discover${value}&limit=${limit}`,
    config
  );
  return response.data;
};

const savePost = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(`${BASE_URL}/savePost/${id}`, {}, config);
  return response.data;
};

const unSavePost = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(
    `${BASE_URL}/unSavePost/${id}`,
    {},
    config
  );
  return response.data;
};

const getSavePosts = async (limit, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let pLimit = limit ? limit : 9;
  const response = await axios.get(
    `${BASE_URL}/getSavePosts?limit=${pLimit}`,
    config
  );
  return response.data;
};

const postService = {
  createPost,
  getPosts,
  getPost,
  deletePost,
  likePost,
  unLikePost,
  getUserPosts,
  getPostsDiscover,
  savePost,
  unSavePost,
  getSavePosts,
};

export default postService;
