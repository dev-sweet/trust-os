import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong!";
    toast.error(message);
    return Promise.reject(error);
  },
);
export default api;
