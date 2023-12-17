import axios from "axios";

import {BASE_URL} from "../../utils/config";

const createMessage = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${BASE_URL}/message`, data, config);
  return response.data;
};

const getConversations = async (search, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let limit = 8;
  let value = search ? search : `?page=${1}`;
  const response = await axios.get(
    `${BASE_URL}/conversations${value}$limit=${limit}`,
    config
  );
  return response.data;
};

const getMessages = async (id, search, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let limit = 8;
  let value = search ? search : `?page=${1}`;
  const response = await axios.get(
    `${BASE_URL}/message/${id}${value}$limit=${limit}`,
    config
  );
  return response.data;
};

const deleteMessages = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${BASE_URL}/message/${id}`, config);
  return response.data;
};

const deleteConversation = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${BASE_URL}/conversation/${id}`, config);
  return response.data;
};

const messageService = {
  createMessage,
  getConversations,
  getMessages,
  deleteMessages,
  deleteConversation,
};

export default messageService;
