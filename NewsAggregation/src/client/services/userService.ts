import axios from "axios";

const BASE_URL = "http://localhost:3000";

export async function fetchHeadlinesByCategory(category: string): Promise<any[]> {
  try {
    const res = await axios.get(`${BASE_URL}/headlines/today`, {
      params: { category },
    });
    return res.data;
  } catch {
    return [];
  }
}

export async function fetchHeadlinesByDateRange(category: string, from: string, to: string): Promise<any[]> {
  try {
    const res = await axios.get(`${BASE_URL}/headlines/range`, {
      params: { category, from, to },
    });
    return res.data;
  } catch {
    return [];
  }
}

export async function fetchSavedArticles(userId: number): Promise<any[]> {
  try {
    const res = await axios.get(`${BASE_URL}/users/${userId}/saved-articles`);
    return res.data;
  } catch {
    return [];
  }
}

export async function saveArticle(userId: number, articleId: string): Promise<boolean> {
  try {
    await axios.post(`${BASE_URL}/users/${userId}/saved-articles`, { articleId });
    return true;
  } catch {
    return false;
  }
}

export async function deleteSavedArticle(userId: number, articleId: string): Promise<boolean> {
  try {
    await axios.delete(`${BASE_URL}/users/${userId}/saved-articles/${articleId}`);
    return true;
  } catch {
    return false;
  }
}

export async function searchArticles(
  keyword: string,
  from?: string,
  to?: string,
  sortBy?: string
): Promise<any[]> {
  try {
    const res = await axios.get(`${BASE_URL}/search`, {
      params: {
        q: keyword,
        from,
        to,
        sort: sortBy,
      },
    });
    return res.data;
  } catch {
    return [];
  }
}

export async function getNotifications(userId: number): Promise<any[]> {
  try {
    const res = await axios.get(`${BASE_URL}/notifications`, { params: { userId } });
    return res.data;
  } catch {
    return [];
  }
}

export async function getNotificationConfig(userId: number): Promise<any> {
  try {
    const res = await axios.get(`${BASE_URL}/notifications/config`, { params: { userId } });
    return res.data;
  } catch {
    return { categories: [], keywordsEnabled: false };
  }
}

export async function toggleCategory(userId: number, categoryId: number | "keywords"): Promise<boolean> {
  try {
    await axios.post(`${BASE_URL}/notifications/category`, { userId, categoryId });
    return true;
  } catch {
    return false;
  }
}

export async function updateKeywords(userId: number, keywords: string): Promise<boolean> {
  try {
    await axios.post(`${BASE_URL}/notifications/keywords`, { userId, keywords });
    return true;
  } catch {
    return false;
  }
}
