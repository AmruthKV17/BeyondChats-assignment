const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Article = require('./models/Article'); 
require('dotenv').config();


const REQUIRED_COUNT = 5;

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beyondchats_assignment')
  .then(() => console.log('MongoDB Connected for Scraper'))
  .catch(err => console.error(err));

async function scrapeArticles() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to blog home...');
    await page.goto('https://beyondchats.com/blogs/', { waitUntil: 'networkidle2' });

 
    const lastPageNum = await page.evaluate(() => {
      
      const links = Array.from(document.querySelectorAll('.page-numbers, .pagination a')); 
      const numbers = links
        .map(link => parseInt(link.innerText))
        .filter(num => !isNaN(num));
      return numbers.length > 0 ? Math.max(...numbers) : 1; 
    });

    console.log(`Last page found: ${lastPageNum}`);
    
    
    let collectedLinks = [];
    let currentPage = lastPageNum;

    while (collectedLinks.length < REQUIRED_COUNT && currentPage >= 1) {
      const pageUrl = `https://beyondchats.com/blogs/page/${currentPage}/`;
      console.log(`Scraping links from: ${pageUrl}`);
      
      await page.goto(pageUrl, { waitUntil: 'networkidle2' });

      const pageLinks = await page.evaluate(() => {
        
        const selectors = [
            'article h2 a', 
            'article h3 a', 
            '.post-title a', 
            '.entry-title a',
            '.blog-post a.read-more'
        ];
        
        let foundLinks = [];
        for (const sel of selectors) {
            const elements = document.querySelectorAll(sel);
            if (elements.length > 0) {
                foundLinks = Array.from(elements).map(el => el.href);
                break;
            }
        }
        return foundLinks;
      });

      console.log(`Found ${pageLinks.length} articles on page ${currentPage}`);

      const oldestFirstOnPage = pageLinks.reverse();

      collectedLinks.push(...oldestFirstOnPage);
      
      currentPage--; // Go to previous page
    }

    const finalLinks = collectedLinks.slice(0, REQUIRED_COUNT);
    console.log(`Final list of ${finalLinks.length} URLs to scrape:`, finalLinks);
    for (const url of finalLinks) {
      console.log(`Scraping content from: ${url}`);
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        
        const data = await page.evaluate(() => {
          const title = document.querySelector('h1')?.innerText || document.title;
          const contentDiv = document.querySelector('.entry-content, .post-content, article, main');
          const content = contentDiv ? contentDiv.innerText : '';
          return { title, content };
        });

        if (data.title && data.content) {
          await Article.findOneAndUpdate(
            { original_url: url },
            {
              title: data.title,
              original_content: data.content,
              original_url: url,
              status: 'pending'
            },
            { upsert: true, new: true }
          );
          console.log(`Saved: ${data.title}`);
        }
      } catch (innerError) {
        console.error(`Failed to scrape ${url}:`, innerError.message);
      }
    }

  } catch (error) {
    console.error('Global Scraping Error:', error);
  } finally {
    await browser.close();
    mongoose.connection.close(); 
    console.log('Scraping Complete.');
  }
}

scrapeArticles();
