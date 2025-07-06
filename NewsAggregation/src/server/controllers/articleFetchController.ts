import { getFetcher, availableSources, getSourceDbName } from '../../news/factory/externalFetcherFactory';
import { ArticleRepository } from '../repositories/articleRepository';
import { CategoryRepository } from '../repositories/categoryRepository';
import { KeywordExtractor } from '../../utils/keywordExtractor';
import { IArticle } from '../../utils/interfaces';
import { ExternalNewsServerRepository } from '../repositories/externalNewsServerRepository';

export class ArticleFetchController {
    private articleRepo = new ArticleRepository();
    private categoryRepo = new CategoryRepository();
    private extenalNewsServerRepo = new ExternalNewsServerRepository()

    public async fetchAndSaveFromAllSources(): Promise<void> {
        for (const source of availableSources()) {
            await this.processSource(source).catch(err => {
                console.error(`[${source}] fetch failed:`, err.message);
            });
        }
    }

    private async processSource(source: string): Promise<void> {
        const fetcher = getFetcher(source);
        const sourceDBName = getSourceDbName(source);
        console.log(`Fetching: ${sourceDBName}`);
        
        const articles = await fetcher.fetchArticles();
        for (const article of articles) {
            await this.processSingleArticle(article, sourceDBName);
        }

        await this.extenalNewsServerRepo.updateLastAccessed(sourceDBName);
        console.log(`Updated last_accessed for "${sourceDBName}"`);
    }

    private async processSingleArticle(article: Omit<IArticle, 'article_id'>, sourceDBName:string): Promise<void> {
        const id = await this.saveArticle(article);
        await this.saveKeywords(id, article);
        await this.saveCategory(id, article);
    }

    private async saveArticle(article: Omit<IArticle, 'article_id'>): Promise<number> {
        return await this.articleRepo.saveArticle(article as IArticle);
    }

    private async saveKeywords(articleId: number, article: Omit<IArticle, 'article_id'>): Promise<void> {
        const text = `${article.title} ${article.description}`;
        const keywords = KeywordExtractor.extractKeywords(article as IArticle);
        if (keywords.length) {
            await this.articleRepo.saveArticleKeywords(articleId, keywords);
        }
    }

    private async saveCategory(articleId: number, article: Omit<IArticle, 'article_id'>): Promise<void> {
        const categoryId = await this.categoryRepo.inferOrCreateCategory(article as IArticle);
        await this.articleRepo.saveArticleCategory(articleId, categoryId);
    }
}
