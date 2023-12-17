import axios from "axios";

import {BASE_URL} from "../../utils/config";

const createNotify = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${BASE_URL}/notify`, data, config);
  return response.data;
};

const removeNotify = async (id, url, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(
    `${BASE_URL}/notify/${id}?url=${url}`,
    config
  );
  return response.data;
};

const getNotifies = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${BASE_URL}/notifies`, config);
  return response.data;
};

const isReadNotify = async (id) => {
  const response = await axios.patch(`${BASE_URL}/isReadNotify/${id}`);
  return response.data;
};

const deleteAllNotifies = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${BASE_URL}/deleteAllNotify`, config);
  return response.data;
};

const notifyService = {
  createNotify,
  removeNotify,
  getNotifies,
  isReadNotify,
  deleteAllNotifies,
};

export default notifyService;
