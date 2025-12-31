const { google } = require('googleapis');
const { REQUIRED_SOURCES } = require('../config/constants');

class GoogleSearchService {
  constructor() {
    this.customSearch = google.customsearch('v1');
  }

  async searchSources(query) {
    try {
      const searchRes = await this.customSearch.cse.list({
        auth: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_CX,
        q: query,
        num: 5 
      });

      const items = searchRes.data.items || [];
      
      const externalSources = items
        .filter(item => !item.link.includes('beyondchats.com'))
        .slice(0, REQUIRED_SOURCES)
        .map(item => ({
          link: item.link,
          title: item.title
        }));

      return externalSources;
    } catch (error) {
      console.error('Google Search Error:', error.message);
      throw error;
    }
  }
}

module.exports = new GoogleSearchService();
