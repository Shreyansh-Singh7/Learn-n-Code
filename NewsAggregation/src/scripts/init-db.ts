import { initializeDatabase } from '../database/init.js';

initializeDatabase().catch(err => {
  console.error('Database initialization failed:', err);
});
