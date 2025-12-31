require('dotenv').config();

const Article = require('./models/Article');
const DatabaseService = require('./services/db');
const GoogleSearchService = require('./services/g-search');
const ScraperService = require('./services/web-scraper');
const AIGeneratorService = require('./services/ai-gen');
const { delay, validateEnv } = require('./utils/helper');
const { REQUIRED_SOURCES, DELAY_BETWEEN_ARTICLES } = require('./config/constants');


class AIProcessor {

  async run() {
    try {
      validateEnv();
      
      await DatabaseService.connect();
      
      await ScraperService.init();
      const articles = await Article.find({ status: 'pending' });
      
      if (articles.length === 0) {
        console.log('\n No pending articles found.');
        return;
      }
      
      console.log(`\n Found ${articles.length} pending articles. Starting batch process...\n`);
      
      for (let i = 0; i < articles.length; i++) {
        await this.processArticle(articles[i], i + 1, articles.length);
        await delay(DELAY_BETWEEN_ARTICLES);
      }
      
      console.log('\n Batch processing complete!');
      
    } catch (error) {
      console.error('\n Fatal Error:', error.message);
    } finally {
      await this.cleanup();
    }
  }
  

  async processArticle(article, current, total) {
    console.log(`[${current}/${total}] Processing: "${article.title}"`);
    
    try {
      const sources = await GoogleSearchService.searchSources(article.title);
      
      if (sources.length < REQUIRED_SOURCES) {
        console.log(`\n  Not enough external sources (${sources.length}/${REQUIRED_SOURCES}). Skipping.`);
        return;
      }
      
      console.log(`\n  Found sources: ${sources.map(s => s.link).join(', ')}`);
      
      const sourceContent = await ScraperService.scrapeSources(sources);
      
      if (!sourceContent.trim()) {
        console.log('\n  No content scraped. Skipping.');
        return;
      }
      
      console.log('\n  Generating ai-enhanced content...');
      const newContent = await AIGeneratorService.generateContent(
        article, 
        sourceContent, 
        sources.map(s => s.link)
      );
      
      article.updated_content = newContent;
      article.status = 'updated';
      article.sources = sources.map(s => s.link);
      await article.save();
      
      console.log('Article updated!\n');
      
    } catch (error) {
      console.error(`Error: ${error.message}\n`);
    }
  }
  
  async cleanup() {
    await ScraperService.close();
    await DatabaseService.disconnect();
  }
}


const processor = new AIProcessor();
processor.run();
