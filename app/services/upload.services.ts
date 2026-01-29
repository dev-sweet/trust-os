import api from "../utils/axios";

export const uploadPhoto = async ({
  path,
  file,
}: {
  path: string;
  file: FormData;
}) => {
  const res = await api.post(`api/${path}`, file);
  return res.data;
};
