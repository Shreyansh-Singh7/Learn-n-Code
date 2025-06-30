// src/server/services/notificationService.ts
import { getDb } from '../../database/db.js';
import { sendEmail } from '../utils/emailService.js';

export async function checkAndSendNotificationsForUser(userId: number, email: string) {
  const db = await getDb();

  const categories = await db.all(
    `SELECT category FROM notification_preferences WHERE user_id = ? AND enabled = 1`,
    [userId]
  );

  const keywords = await db.all(
    `SELECT keyword FROM keyword_preferences WHERE user_id = ?`,
    [userId]
  );

  const categoryList = categories.map((c: any) => c.category);
  const keywordList = keywords.map((k: any) => k.keyword.toLowerCase());

  if (categoryList.length === 0 && keywordList.length === 0) return;

  const articles = await db.all(
    `SELECT * FROM articles WHERE published_at >= datetime('now', '-1 day')`
  );

  const matchingArticles = articles.filter((article: any) => {
    const matchCategory = categoryList.includes(article.category);
    const matchKeyword = keywordList.some(k =>
      (article.title + article.description).toLowerCase().includes(k)
    );
    return matchCategory || matchKeyword;
  });

  for (const article of matchingArticles) {
    const alreadySent = await db.get(
      `SELECT * FROM notifications WHERE user_id = ? AND article_id = ?`,
      [userId, article.article_id]
    );
    console.log(alreadySent)

    if (!alreadySent) {
      // Save notification
      await db.run(
        `INSERT INTO notifications (user_id, article_id, title, content, sent_at) VALUES (?, ?, ?, ?, ?)`,
        userId,
        article.article_id,
        article.title,
        article.description || '',
        new Date().toISOString()
      );
      console.log('sending', article.title, 'to email',email);

      // Send email
      await sendEmail(email, `📰 New article: ${article.title}`, `${article.description}\n\nRead more: ${article.url}`);
    }
  }
}
