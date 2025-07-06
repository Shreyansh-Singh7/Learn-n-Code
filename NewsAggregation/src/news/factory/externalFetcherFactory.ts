import { INewsFetcher } from '../interfaces/INewsFetcher';
import { NewsApiFetcher } from '../sources/newsApiFetcher';
import { TheNewsApiFetcher } from '../sources/theNewsApiFetcher';

const fetcherConstructors: Record<string, new () => INewsFetcher> = {
    newsapi: NewsApiFetcher,
    thenewsapi: TheNewsApiFetcher,
};

const sourceToDbName: Record<string, string> = {
    newsapi: 'News API',
    thenewsapi: 'The News API',
  };

export function getFetcher(source: string): INewsFetcher {
    const fetcher = fetcherConstructors[source];
    if (!fetcher) {
        throw new Error(`Unknown news source: ${source}`);
    }
    return new fetcher();
}

export function getSourceDbName(source: string): string {
    return sourceToDbName[source] || source;
  }

export function availableSources(): string[] {
    return Object.keys(fetcherConstructors);
}
