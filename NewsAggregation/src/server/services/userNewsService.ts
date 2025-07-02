import { UserNewsRepository } from "../repositories/userNewsRepository.ts";

export class UserNewsService {
  private repository = new UserNewsRepository();

  async saveArticle(userId: number, articleId: string) {
    if (!articleId) throw new Error("Missing article ID");
    await this.repository.saveArticle(userId, articleId);
  }

  async unsaveArticle(userId: number, articleId: string) {
    if (!articleId) throw new Error("Missing article ID");
    await this.repository.unsaveArticle(userId, articleId);
  }

  async getSavedArticles(userId: number) {
    return await this.repository.getSavedArticles(userId);
  }
}
