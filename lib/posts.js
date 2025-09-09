import { query } from "./db.js";

// ✅ إنشاء الجداول (هتتعمل مرة واحدة فقط)
export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      email TEXT
    )
  `);

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

  await query(`
    CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      PRIMARY KEY(user_id, post_id)
    )
  `);

  // ✅ إدخال يوزرات تجريبية لو مش موجودين
  const result = await query(`SELECT COUNT(*) FROM users`);
  if (parseInt(result.rows[0].count) === 0) {
    await query(`
      INSERT INTO users (first_name, last_name, email)
      VALUES ('John', 'Doe', 'john@example.com'),
             ('Max', 'Schwarz', 'max@example.com')
    `);
  }
}

// ✅ جلب البوستات
export async function getPosts(maxNumber) {
  let sql = `
    SELECT posts.id, image_url AS image, title, content, created_at AS "createdAt",
           first_name AS "userFirstName", last_name AS "userLastName",
           COUNT(likes.post_id) AS likes,
           EXISTS(
             SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = 2
           ) AS "isLiked"
    FROM posts
    INNER JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    GROUP BY posts.id, users.first_name, users.last_name
    ORDER BY "createdAt" DESC
  `;

  // هنا هنضيف LIMIT لو بس المستخدم بعته
  const params = [];
  if (maxNumber) {
    params.push(maxNumber);
    sql += ` LIMIT $${params.length}`; // هنا $1 أو $2 حسب عدد الباراميترز
  }

  await new Promise((r) => setTimeout(r, 1000));

  const result = await query(sql, params);
  return result.rows;
}

// ✅ إضافة بوست جديد
export async function storePost(post) {
  const sql = `
    INSERT INTO posts (image_url, title, content, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  await new Promise((r) => setTimeout(r, 1000));
  const result = await query(sql, [
    post.imageUrl,
    post.title,
    post.content,
    post.userId,
  ]);
  return result.rows[0];
}

// ✅ تحديث حالة الـ Like
export async function updatePostLikeStatus(postId, userId) {
  const checkSql = `
    SELECT COUNT(*) FROM likes WHERE user_id = $1 AND post_id = $2
  `;
  const result = await query(checkSql, [userId, postId]);
  const isLiked = parseInt(result.rows[0].count) === 0;

  if (isLiked) {
    const insertSql = `
      INSERT INTO likes (user_id, post_id) VALUES ($1, $2)
      RETURNING *
    `;
    await new Promise((r) => setTimeout(r, 1000));
    return (await query(insertSql, [userId, postId])).rows[0];
  } else {
    const deleteSql = `
      DELETE FROM likes WHERE user_id = $1 AND post_id = $2
    `;
    await new Promise((r) => setTimeout(r, 1000));
    return (await query(deleteSql, [userId, postId])).rowCount;
  }
}
