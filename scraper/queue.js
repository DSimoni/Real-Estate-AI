const Bull = require('bull');
const { scrapeMerrjep } = require('./scrapers'); // Import specific scraper functions
// const { scrapeOtherPortal } = require('./scrapers'); // Import other scrapers as needed

// ... (your Redis and DB pool setup) ...

const scrapeQueue = new Bull('scrapeQueue', process.env.REDIS_URL);

async function processScrapeJob(job) {
  console.log(`Processing scrape job (type: ${job.data.type || 'default'})...`);

  try {
    // Determine which scraper to run based on job data, or run all
    if (job.data.portal === 'merrjep' || job.data.type === 'initial_run') { // Run Merrjep on initial or if specified
        await scrapeMerrjep();
    }
    // else if (job.data.portal === 'otherportal') {
    //    await scrapeOtherPortal();
    // }
    // else { // If no specific portal, maybe run all or log a warning
    //    console.warn('Unknown portal specified in job, or no specific portal. Running Merrjep as default.');
    //    await scrapeMerrjep();
    // }

  } catch (error) {
    console.error(`Job failed for portal ${job.data.portal || 'default'}:`, error);
    throw error; // Re-throw to indicate job failure to Bull
  } finally {
    console.log(`Finished processing scrape job (type: ${job.data.type || 'default'}).`);
  }
}

scrapeQueue.process(processScrapeJob);
console.log("Scrape job processor is defined.");

// Add jobs:
// Schedule Merrjep to run every 5 minutes
scrapeQueue.add({ portal: 'merrjep' }, { repeat: { cron: '*/5 * * * *' } });
console.log("Scheduled Merrjep scrape job to run every 5 minutes.");

// Add an immediate job for testing (could specify portal if you only want one)
scrapeQueue.add({ type: 'initial_run', portal: 'merrjep' });
console.log("Added an immediate Merrjep scrape job for initial testing.");

// ... (BullMQ event listeners) ...