import { NotificationRepository } from "../repositories/notificationRepository.ts";

export class NotificationService {
  private repository = new NotificationRepository();

  async getUserNotifications(userId: number) {
    return await this.repository.getUserNotifications(userId);
  }

  async getNotificationConfig(userId: number) {
    const categories = await this.repository.getCategoryPreferences(userId);
    const keywordsRaw = await this.repository.getKeywordPreferences(userId);
    const keywords = keywordsRaw.map((k) => k.keyword);
    return { categories, keywords };
  }

  async toggleCategory(userId: number, category: string, enabled: boolean) {
    await this.repository.upsertCategoryPreference(userId, category, enabled);
  }

  async updateKeywords(userId: number, keywords: string[]) {
    await this.repository.updateKeywords(userId, keywords);
  }
}
