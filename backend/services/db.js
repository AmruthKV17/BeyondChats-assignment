const mongoose = require('mongoose');
class DatabaseService {
  static async connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(' MongoDB Connected');
    } catch (error) {
      console.error(' MongoDB Connection Error:', error.message);
      throw error;
    }
  }

  static async disconnect() {
    try {
      await mongoose.connection.close();
      console.log(' MongoDB Disconnected');
    } catch (error) {
      console.error(' MongoDB Disconnect Error:', error.message);
    }
  }
}

module.exports = DatabaseService;
