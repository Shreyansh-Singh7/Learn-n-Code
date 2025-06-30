import { getDb } from '../../database/db.js';

export async function saveArticle(req:any, res:any) {
  const userId = req.user.userId;
  const { articleId } = req.body;

  if (!articleId) return res.status(400).json({ error: 'Missing article ID' });

  try {
    const db = await getDb();
    await db.run(
      `INSERT OR IGNORE INTO saved_articles (user, article_id) VALUES (?, ?)`,
      [userId, articleId]
    );
    res.json({ message: 'Article saved successfully' });
  } catch (err) {
    console.error('Error saving article:', err);
    res.status(500).json({ error: 'Failed to save article' });
  }
}

export async function unsaveArticle(req:any, res:any) {
  const userId = req.user.userId;
  const { articleId } = req.params;

  try {
    const db = await getDb();
    await db.run(
      `DELETE FROM saved_articles WHERE user = ? AND article_id = ?`,
      [userId, articleId]
    );
    res.json({ message: 'Article removed from saved list' });
  } catch (err) {
    console.error('Error deleting saved article:', err);
    res.status(500).json({ error: 'Failed to remove saved article' });
  }
}

export async function getSavedArticles(req:any, res:any) {
  const userId = req.user.userId;

  try {
    const db = await getDb();
    const articles = await db.all(
      `SELECT a.* FROM articles a
       JOIN saved_articles s ON a.article_id = s.article_id
       WHERE s.user = ?`,
      [userId]
    );
    res.json(articles);
  } catch (err) {
    console.error('Error fetching saved articles:', err);
    res.status(500).json({ error: 'Failed to fetch saved articles' });
  }
}
