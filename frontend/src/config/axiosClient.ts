import axios from "axios";
import { supabaseClient } from "./supabaseClient";

const apiUrl = import.meta.env.VITE_API_URL;
console.log("API URL:", apiUrl);
if (!apiUrl) {
  throw new Error("Missing environment variable: VITE_API_URL is required.");
}

export const axiosClient = axios.create({
  baseURL: apiUrl,
});

axiosClient.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});
