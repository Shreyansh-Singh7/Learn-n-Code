export interface IArticleReactionRepository {
    getUserReaction(userId: number, articleId: number): Promise<'like' | 'dislike' | null>;
    addOrUpdateReaction(userId: number, articleId: number, reaction: 'like' | 'dislike'): Promise<void>;
    removeReaction(userId: number, articleId: number): Promise<void>;
    updateArticleReactionCount(articleId: number, column: 'likes' | 'dislikes', delta: number): Promise<void>;
}
