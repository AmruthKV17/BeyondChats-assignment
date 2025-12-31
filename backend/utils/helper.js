const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const validateEnv = () => {
  const required = ['MONGO_URI', 'GOOGLE_API_KEY', 'GOOGLE_CX', 'GEMINI_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

module.exports = {
  delay,
  validateEnv
};  
