import { ArticleService } from "../services/articleService.ts";

const articleService = new ArticleService();

export const likeArticle = async (articleId: string): Promise<void> => {
  await articleService.likeArticle(articleId);
};

export const dislikeArticle = async (articleId: string): Promise<void> => {
  await articleService.dislikeArticle(articleId);
};

export const updateKeywords = async (articleId: string): Promise<void> => {
  await articleService.updateKeywords(articleId);
};

export const searchArticles = async (keyword: string): Promise<any[]> => {
  return articleService.searchArticles(keyword);
};

export const getAllArticles = async (): Promise<any[]> => {
  return articleService.getAllArticles();
};
