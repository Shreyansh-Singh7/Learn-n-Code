export interface ISavedArticleRepository {
    save(userId: number, articleId: number): Promise<number>;
    delete(userId: number, articleId: number): Promise<void>;
    getSavedArticlesIds(userId: number): Promise<{ article_id: number; saved_at: Date }[]>;
}
  