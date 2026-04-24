const { sql } = require('@vercel/postgres');

async function createTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        body TEXT NOT NULL
      );
    `;
    console.log("Table created successfully!");
  } catch (err) {
    console.error("Error creating table:", err);
  }
}

createTable();
