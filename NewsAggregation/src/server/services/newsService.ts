import { NewsRepository } from "../repositories/newsRepository.ts";

export class NewsService {
  private repository = new NewsRepository();

  async getTodaysNews() {
    const dayStart = new Date();
    dayStart.setUTCDate(dayStart.getUTCDate() - 1);
    dayStart.setUTCHours(0, 0, 0, 0);

    const dayEnd = new Date();
    dayEnd.setUTCDate(dayEnd.getUTCDate() - 1);
    dayEnd.setUTCHours(23, 59, 59, 999);

    return await this.repository.getNewsByDateRange(
      dayStart.toISOString(),
      dayEnd.toISOString()
    );
  }

  async getAllNews() {
    return await this.repository.getAllNews();
  }

  async filterNews(category?: string, from?: string, to?: string) {
    return await this.repository.filterNews(category, from, to);
  }
}
