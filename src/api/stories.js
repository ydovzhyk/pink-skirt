import axios from 'axios';

const origin = typeof window !== 'undefined' ? window.location.origin : '';
export const axiosCreateStory = async userData => {
    const { data } = await axios.post(`${origin}/api/stories/create-story`, userData);
    return data;
};

export const axiosGetStories = async (userData) => {
  const { data } = await axios.get(`${origin}/api/stories/get-stories`, {
    params: { page: userData.page, limit: userData.limit },
  });
  return data;
};

export const axiosGetStory = async userData => {
  const { data } = await axios.get(`${origin}/api/stories/get-story`, {
    params: { id: userData.id },
  });
  return data;
};

export const axiosEditStory = async userData => {
  const { data } = await axios.post(`${origin}/api/stories/edit-story`, userData);
  return data;
};

export const axiosDeleteStory = async id => {
  const { data } = await axios.delete(`${origin}/api/stories/delete-story`, {
    data: { id },
  });
  return data;
};
