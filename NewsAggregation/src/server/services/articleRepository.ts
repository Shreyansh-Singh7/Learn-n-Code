// src/server/services/articleRepository.ts
import { db } from '../db.js';
import { Article } from '../models/articleModel.js';

export async function saveArticle(article: Article): Promise<void> {
  const query = `
    INSERT OR IGNORE INTO articles (title, description, url, source, published_at, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await db.run(query, [
    article.title,
    article.description,
    article.url,
    article.source,
    article.published_at,
    article.category,
  ]);
}

export async function getAllArticles(): Promise<Article[]> {
  const query = `SELECT * FROM articles ORDER BY published_at DESC`;
  return db.all<Article[]>(query);
}
