import axios from 'axios';

const origin = typeof window !== 'undefined' ? window.location.origin : '';
export const axiosCreateModel = async userData => {
  const { data } = await axios.post(
    `${origin}/api/models/create-model`,
    userData
  );
  return data;
};

export const axiosGetModels = async () => {
  const { data } = await axios.get(`${origin}/api/models/get-models`);
  return data;
};

export const axiosGetModel = async userData => {
  const { data } = await axios.get(`${origin}/api/models/get-model`, {
    params: { id: userData.id },
  });
  return data;
};

export const axiosEditModel = async userData => {
  const { data } = await axios.post(
    `${origin}/api/models/edit-model`,
    userData
  );
  return data;
};

export const axiosDeleteModel = async id => {
  const { data } = await axios.delete(`${origin}/api/models/delete-model`, {
    data: { id },
  });
  return data;
};
