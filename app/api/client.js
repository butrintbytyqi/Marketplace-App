import { create } from "apisauce";

const api = create({
  baseURL: "http://192.168.0.23:9000/api",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default api;
