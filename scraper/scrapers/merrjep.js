const axios = require('axios');
const cheerio = require('cheerio');
const { insertListing } = require('../utils/db'); // Assuming db.js exports insertListing
const fs = require('fs'); // For debugging HTML

async function scrapeMerrjep() {
  const url = 'https://www.merrjep.al/njoftime/imobiliare-vendbanime/apartamente/ne-shitje';
  console.log(`Starting scrape for Merrjep URL: ${url}`);
  const listings = [];

  try {
    const { data: html } = await axios.get(url);
    console.log('Successfully fetched Merrjep HTML data.');

    // Save HTML for debugging specific portal issues
    const filename = 'fetched_merrjep.html';
    fs.writeFileSync(filename, html);
    console.log(`Merrjep HTML saved to ${filename} for inspection.`);

    const $ = cheerio.load(html);

    // Filter out ads or non-listing content if merrjep.al's structure includes them
    // Example: Only target elements within the main listing container if it exists
    const listingContainers = $('.goodssearch-item-content'); // Use your most precise selector here

    if (listingContainers.length === 0) {
      console.warn('Merrjep: No listing containers found. Check selector or page structure.');
    } else {
      console.log(`Merrjep: Found ${listingContainers.length} listing containers.`);
    }

    listingContainers.each((index, el) => {
      // **Refine these selectors based on your HTML inspection for Merrjep!**
      const title = $(el).find('h2 a').text().trim();
      const rawLink = $(el).find('h2 a').attr('href');
      const link = rawLink ? `https://www.merrjep.al${rawLink}` : null;
      let priceText = $(el).find('.list-price').text().trim();

      // Price parsing logic (as refined previously)
      let price = null;
      if (priceText) {
        const cleanedPrice = priceText.replace(/[^0-9.]/g, '');
        if (cleanedPrice) {
          const parsedPrice = parseFloat(cleanedPrice);
          if (!isNaN(parsedPrice)) {
            price = parsedPrice;
          }
        }
      }

      // Basic validation and filtering (e.g., if you still pick up non-real-estate items)
      if (!title || !link || !link.includes('njoftim/apartament')) { // Example filter
        console.warn(`Merrjep: Skipping invalid/irrelevant listing: "${title}" - ${link}`);
        return; // Skip this iteration
      }

      // Truncate title if still too long for DB (after fixing selectors)
      const MAX_TITLE_LENGTH = 1024; // Align with your DB schema
      const finalTitle = title.length > MAX_TITLE_LENGTH ? title.substring(0, MAX_TITLE_LENGTH) : title;


      listings.push({ title: finalTitle, link, price });
    });

    console.log(`Merrjep: Finished parsing. Total valid listings found: ${listings.length}`);

    // Insert into DB (moved outside the loop for potential batch insertion later)
    for (const listing of listings) {
        await insertListing(listing); // insertListing handles ON CONFLICT DO NOTHING
    }
    console.log(`Merrjep: Attempted to insert ${listings.length} listings.`);


  } catch (error) {
    console.error(`Merrjep: Error during scraping: ${error.message}`);
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Response data: ${error.response.data}`);
    }
    throw error;
  }
}

module.exports = { scrapeMerrjep };