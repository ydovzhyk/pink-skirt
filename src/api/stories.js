import axios from 'axios';

const origin = typeof window !== 'undefined' ? window.location.origin : '';
export const axiosCreateStory = async userData => {
    const { data } = await axios.post(`${origin}/api/create-story`, userData);
    return data;
};

export const axiosGetStories = async (userData) => {
  const { data } = await axios.get(`${origin}/api/get-stories`, {
    params: { page: userData.page, limit: userData.limit },
  });
  return data;
};

export const axiosGetStory = async userData => {
  const { data } = await axios.get(`${origin}/api/get-story`, {
    params: { id: userData.id },
  });
  return data;
};

export const axiosEditStory = async userData => {
  const { data } = await axios.post(`${origin}/api/edit-story`, userData);
  return data;
};

export const axiosDeleteStory = async userData => {
  const { data } = await axios.delete(`${origin}/delete-story`, userData);
  return data;
};
