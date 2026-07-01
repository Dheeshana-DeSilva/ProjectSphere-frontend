// User Service - API calls for user operations
import api from '../config/api.js';

// Get user profile by ID
export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Follow/Unfollow a user
export const followUser = async (userId) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
};

// Update profile picture
export const updateProfilePicture = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await api.patch('/auth/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get user's followers
export const getUserFollowers = async (userId) => {
  const response = await api.get(`/users/${userId}/followers`);
  return response.data;
};

// Get users that user is following
export const getUserFollowing = async (userId) => {
  const response = await api.get(`/users/${userId}/following`);
  return response.data;
};
