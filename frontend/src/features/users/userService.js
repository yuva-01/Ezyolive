import axios from 'axios';

const API_URL = '/api/users/';

// Get all users
const getUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data.data;
};

// Get user by ID
const getUserById = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + userId, config);

  return response.data.data;
};

// Update user
const updateUser = async (userId, userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + userId, userData, config);

  return response.data.data;
};

const userService = {
  getUsers,
  getUserById,
  updateUser,
};

export default userService;
