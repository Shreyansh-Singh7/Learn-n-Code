import axios from "axios";
import { IUser } from "../types/models";

const BASE_URL = "http://localhost:5000"; // Adjust based on your server config

export async function loginUser(email: string, password: string): Promise<IUser | null> {
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
    return res.data;
  } catch {
    return null;
  }
}

export async function signupUser(username: string, email: string, password: string): Promise<boolean> {
  try {
    await axios.post(`${BASE_URL}/api/auth/signup`, { username, email, password });
    return true;
  } catch {
    return false;
  }
}
