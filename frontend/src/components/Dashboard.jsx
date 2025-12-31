import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ArticleCard from './ArticleCard';
import ComparisonModal from './ComparisonModal';

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data fallback if API fails
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://beyondchats-assignment-backend-7s9j.onrender.com/api/articles');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.warn('Using mock data', error);
        setArticles([
          {
            _id: "1",
            title: "The Future of AI in Web Development",
            status: "pending",
            original_content: "AI is changing how we build websites. It is very fast and can write code. Developers need to learn it.",
            updated_content: null
          },
          {
            _id: "2",
            title: "Understanding React Hooks",
            status: "updated",
            original_content: "React hooks are functions that let you use state and other React features without writing a class.",
            updated_content: "# Understanding React Hooks\n\nReact hooks fundamentally transformed modern web development by enabling state and lifecycle features in functional components.\n\n## Key Benefits:\n- **Reusability**: Custom hooks allow logic sharing.\n- **Simplicity**: No need for `this` keyword.\n- **Organization**: Group related logic together."
          },
            {
            _id: "3",
            title: "CSS Grid vs Flexbox",
            status: "pending",
            original_content: "Grid is for 2D layouts. Flexbox is for 1D layouts. They are both good.",
            updated_content: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center relative">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-neon-purple to-secondary inline-block mb-4">
          AI Blog Editor
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Transform your rough drafts into polished, professional articles with our advanced AI engine.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {articles.map((article) => (
            <motion.div key={article._id} variants={item}>
              <ArticleCard 
                article={article} 
                onClick={setSelectedArticle}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {selectedArticle && (
        <ComparisonModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
