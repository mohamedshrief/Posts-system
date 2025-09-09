import { query } from "./db.js";

export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS news (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE,
      title TEXT,
      content TEXT,
      date TEXT,
      image TEXT
    );
  `);

  const count = await query("SELECT COUNT(*) FROM news");

  if (count.rows[0].count === "0") {
    const dummyNews = [
      {
        slug: "will-ai-replace-humans",
        title: "Will AI Replace Humans?",
        image: "ai-robot.jpg",
        date: "2021-07-01",
        content: "Since late 2022 AI is on the rise...",
      },
      {
        slug: "beaver-plague",
        title: "A Plague of Beavers",
        image: "beaver.jpg",
        date: "2022-05-01",
        content: "Beavers are taking over the world...",
      },
    ];

    for (const news of dummyNews) {
      await query(
        "INSERT INTO news (slug, title, content, date, image) VALUES ($1, $2, $3, $4, $5)",
        [news.slug, news.title, news.content, news.date, news.image]
      );
    }
  }
}
