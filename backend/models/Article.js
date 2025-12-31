const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  original_content: { type: String, required: true },
  original_url: { type: String, required: true, unique: true },
  updated_content: { type: String, default: "" },
  status: { type: String, enum: ['pending', 'updated'], default: 'pending' },
  sources: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
