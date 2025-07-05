
import axios from "axios";

const BASE_URL = "http://localhost:3000"; // Change as per actual server

export async function fetchServerStatuses(): Promise<any[]> {
  try {
    const res = await axios.get(`${BASE_URL}/admin/servers/status`);
    return res.data;
  } catch {
    return [];
  }
}

export async function fetchServerDetails(): Promise<any[]> {
  try {
    const res = await axios.get(`${BASE_URL}/admin/servers`);
    return res.data;
  } catch {
    return [];
  }
}

export async function updateServerKey(id: number, apiKey: string): Promise<boolean> {
  try {
    await axios.put(`${BASE_URL}/admin/servers/${id}`, { apiKey });
    return true;
  } catch {
    return false;
  }
}

export async function addNewsCategory(name: string): Promise<boolean> {
  try {
    await axios.post(`${BASE_URL}/admin/categories`, { name });
    return true;
  } catch {
    return false;
  }
}
