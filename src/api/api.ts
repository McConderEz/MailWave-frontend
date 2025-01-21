import axios from "axios";

export const API_URL: string = "http://localhost:5111/api/";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
