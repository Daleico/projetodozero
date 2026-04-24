import { sql } from '@vercel/postgres';

export async function saveComment(name: string, email: string, body: string) {
  try {
    const result = await sql`
      INSERT INTO comments (name, email, body)
      VALUES (${name}, ${email}, ${body})
      RETURNING *;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error saving comment:', error);
    throw new Error('Failed to save comment to database');
  }
}

export async function getComments() {
  try {
    const result = await sql`
      SELECT id, name, email, body FROM comments
      ORDER BY id DESC;
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments from database');
  }
}
