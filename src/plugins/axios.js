import axios from "axios";
import router from "../router/index.js";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  //   config.headers.Authorization = `Bearer ${store.state.user.token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // console.log(error.response.status);
    // Tangkap nilai status dari respons error
    const statusCode = error.response ? error.response.status : null;

    // Lakukan sesuatu dengan nilai status, misalnya, tampilkan pesan kesalahan atau lakukan tindakan tertentu
    // console.log("Error status code:", statusCode);

    // Dilemparkan kembali error agar dapat ditangani oleh blok catch di pemanggilan aslinya
    throw error;
  }
);

export default axiosClient;
