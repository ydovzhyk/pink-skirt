import axios from 'axios';

const origin = typeof window !== 'undefined' ? window.location.origin : '';
export const axiosCreateReadyGood = async userData => {
  const { data } = await axios.post(
    `${origin}/api/create-ready-good`,
    userData
  );
  return data;
};

export const axiosGetReadyGoods = async userData => {
  const { data } = await axios.get(`${origin}/api/get-ready-goods`, {
    params: { page: userData.page, limit: userData.limit },
  });
  return data;
};

export const axiosGetReadyGood = async userData => {
  const { data } = await axios.get(`${origin}/api/get-ready-good`, {
    params: { id: userData.id },
  });
  return data;
};

export const axiosEditReadyGood = async userData => {
  const { data } = await axios.post(`${origin}/api/edit-ready-good`, userData);
  return data;
};

export const axiosDeleteReadyGood = async id => {
  const { data } = await axios.delete(`${origin}/api/delete-ready-good`, {
    data: { id },
  });
  return data;
};
