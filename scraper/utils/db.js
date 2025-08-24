const { Pool } = require('pg'); // Import Pool instead of Client


// Initialize the connection pool once when your application starts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional: Configure pool size and idle timeout for better resource management
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // How long to wait for a connection from the pool
});

// Add an error listener for the pool (highly recommended)
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client in the pool', err);
  // It's a good idea to exit or restart the process if a critical pool error occurs
  process.exit(-1);
});

async function insertListing({ title, link, price }) {
  // Add logging for better debugging (as discussed in previous answers)
  if (!title || !link) {
    console.warn(`⚠️ Skipping insertion due to missing title or link: Title="${title}", Link="${link}"`);
    return;
  }

  try {
    // Use pool.query() directly for single queries (most common and recommended)
    // The pool will automatically get a client, run the query, and release the client back.
    const result = await pool.query(
      'INSERT INTO listings (title, link, price) VALUES ($1, $2, $3) ON CONFLICT (link) DO NOTHING',
      [title, link, price]
    );

    if (result.rowCount > 0) {
      console.log(`✅ Successfully inserted new listing: "${title}" (Link: ${link})`);
    } else {
      console.log(`ℹ️ Listing already exists (link: ${link}), skipped insertion for: "${title}"`);
    }
  } catch (error) {
    console.error(`❌ Error inserting listing "${title}" (Link: ${link}):`, error.message);
    throw error; // Re-throw for higher-level error handling (e.g., in your BullMQ worker)
  }
}
module.exports = { insertListing };