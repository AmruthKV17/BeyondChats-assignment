const puppeteer = require('puppeteer');
const { SCRAPE_TIMEOUT, MAX_CONTENT_LENGTH, USER_AGENT } = require('../config/constants');

class ScraperService {
  constructor() {
    this.browser = null;
  }

  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      console.log('Browser initialized!');
    }
  }

  
  async scrapeSources(sources) {
    let combinedContent = "";

    for (const source of sources) {
      try {
        const content = await this.scrapeSingleSource(source);
        combinedContent += `\n--- SOURCE: ${source.title} ---\n${content}\n`;
      } catch (error) {
        console.error(`Failed to scrape ${source.link}: ${error.message}`);
      }
    }

    return combinedContent;
  }

  
  async scrapeSingleSource(source) {
    const page = await this.browser.newPage();
    
    try {
      await page.setUserAgent(USER_AGENT);
      await page.goto(source.link, { 
        waitUntil: 'domcontentloaded', 
        timeout: SCRAPE_TIMEOUT 
      });
      
      const text = await page.evaluate((maxLength) => {
        const paragraphs = Array.from(document.querySelectorAll('p'));
        return paragraphs
          .map(p => p.innerText)
          .join('\n')
          .substring(0, maxLength);
      }, MAX_CONTENT_LENGTH);
      
      return text;
    } finally {
      await page.close();
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('Browser closed..._');
    }
  }
}

module.exports = new ScraperService();
