import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || "Something went wrong!";
    // console.log(message);
    // if (typeof window !== "undefined") {
    //   toast.error(message);
    // }
    // toast.error(message);
    return Promise.reject(error);
  },
);
export default api;
