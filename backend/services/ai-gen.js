const { GoogleGenerativeAI } = require("@google/generative-ai");
const { MAX_ORIGINAL_CONTENT } = require('../config/constants');

class AIGeneratorService {
  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateContent(article, sourceContent, sources) {
    const prompt = this.buildPrompt(article, sourceContent, sources);
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Generation Error:', error.message);
      throw error;
    }
  }

  buildPrompt(article, sourceContent, sources) {
    return `
      You are an expert tech blog editor.
      
      Original Title: "${article.title}"
      
      Original Content: "${article.original_content.substring(0, MAX_ORIGINAL_CONTENT)}..."
      
      New Research from Top Sources:
      ${sourceContent}
      
      TASK: Rewrite the article to be comprehensive, accurate, and professional.
      - Maintain the original tone but improve clarity and depth
      - Use Markdown formatting (## Headers, **Bold**, Lists)
      - Make it engaging and well-structured
      - Include a "References" section at the end with these links:
        ${sources.map((url, i) => `${i + 1}. ${url}`).join('\n        ')}
      
      Output only the rewritten article content in Markdown format.
    `;
  }
}

module.exports = new AIGeneratorService();
