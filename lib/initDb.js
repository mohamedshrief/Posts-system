import { query } from "./db.js";

export async function initDb() {
  console.log("Creating users table...");
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      email TEXT
    )
  `);

  console.log("Creating posts table...");
  await query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      image_url TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log("Creating likes table...");
  await query(`
    CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      PRIMARY KEY(user_id, post_id)
    )
  `);

  const result = await query(`SELECT COUNT(*) FROM users`);
  if (parseInt(result.rows[0].count) === 0) {
    console.log("Inserting dummy users...");
    await query(`
      INSERT INTO users (first_name, last_name, email)
      VALUES ('John', 'Doe', 'john@example.com'),
             ('Max', 'Schwarz', 'max@example.com')
    `);
  }
  console.log("DB init done!");
}
