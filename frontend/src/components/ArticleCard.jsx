import { motion } from 'framer-motion';
import { Sparkles, Edit3 } from 'lucide-react';

const ArticleCard = ({ article, onClick }) => {
  const isEnhanced = article.status === 'updated'; // Updated status check based on backend data

  return (
    <motion.div
      layoutId={`card-${article._id}`} // Use _id from MongoDB
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-panel rounded-xl p-6 cursor-pointer relative overflow-hidden group border border-white/5 hover:border-white/10 transition-colors"
      onClick={() => onClick(article)}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Status Badge */}
      <div className={`absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 border ${
        isEnhanced 
          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      }`}>
        {isEnhanced ? <Sparkles size={12} /> : <Edit3 size={12} />}
        {isEnhanced ? 'AI Enhanced' : 'Pending'}
      </div>

      <h3 className="text-xl font-bold text-white mb-2 relative z-10 line-clamp-2 pr-28">
        {article.title}
      </h3>
      
      <p className="text-gray-400 text-sm line-clamp-3 relative z-10">
        {article.original_content} 
      </p>

      {/* Decorative Elements */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors" />
    </motion.div>
  );
};

export default ArticleCard;
