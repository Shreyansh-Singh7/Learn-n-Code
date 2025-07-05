import { ArticleRepository } from "../repositories/articleRepository.ts";

export class ArticleService {
  private repository: ArticleRepository;

  constructor() {
    this.repository = new ArticleRepository();
  }

  async likeArticle(articleId: string): Promise<void> {
    await this.repository.likeArticle(articleId);
  }

  async dislikeArticle(articleId: string): Promise<void> {
    await this.repository.dislikeArticle(articleId);
  }

  async updateKeywords(articleId: string): Promise<void> {
    const article = await this.repository.getArticleById(articleId);
    if (!article) throw new Error("Article not found");

    const titleWords = article.title?.split(/\W+/) || [];
    const descWords = article.description?.split(/\W+/) || [];

    const keywordSet = new Set<string>();
    [...titleWords, ...descWords].forEach(word => {
      const lower = word.toLowerCase();
      if (lower.length > 3) keywordSet.add(lower);
    });

    const keywords = Array.from(keywordSet).join(", ");
    await this.repository.updateKeywords(articleId, keywords);
  }

  async searchArticles(keyword: string): Promise<any[]> {
    return this.repository.searchArticlesByKeyword(keyword.toLowerCase());
  }

  async getAllArticles(): Promise<any[]> {
    return this.repository.getAllArticles();
  }
}
