import { IArticle } from '../../utils/interfaces';

export interface INewsFetcher {
    fetchArticles(): Promise<IArticle[]>;
}
