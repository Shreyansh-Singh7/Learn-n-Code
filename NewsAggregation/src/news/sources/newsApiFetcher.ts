import { INewsFetcher } from '../interfaces/INewsFetcher';
import { IArticle } from '../../utils/interfaces';
import axios from 'axios';
import dotenv from "dotenv";
import { ExternalNewsServerRepository } from '../../server/repositories/externalNewsServerRepository';
import { getRandomInt } from '../../utils/helpers';

dotenv.config();

export class NewsApiFetcher implements INewsFetcher {
    private externalServerRepository = new ExternalNewsServerRepository();
    private readonly baseUrlOfApi = process.env.NEWS_API_URL;

    async fetchArticles(): Promise<IArticle[]> {
        const apiKey = await this.externalServerRepository.getApiKeyByName('News API');

        if (!this.baseUrlOfApi) throw new Error('API URL not found for News API');
        if (!apiKey) throw new Error('API key not found for News API');

        const response = await axios.get(this.baseUrlOfApi, {
            params: { apiKey }
          });
        
        return this.mapArticles(response.data.articles);
    }

    private mapArticles(items: any[]): IArticle[] {
        return items.map(item => ({
            article_id: 0,
            title: item.title,
            description: item.description,
            url: item.url,
            image_url: item.urlToImage,
            source: 'News API',
            language: 'en',
            published_at: item.publishedAt,
            likes: getRandomInt(0, 1000),
            dislikes: getRandomInt(0, 500),
        }));
    }
  }
