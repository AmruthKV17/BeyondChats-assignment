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
    <div className="min-h-screen w-full px-4 py-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
      <header className="mb-12 text-center relative w-full max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-neon-purple to-secondary inline-block mb-4">
          AI-powered Content Automation System
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Transform your rough drafts into polished, professional articles with our advanced AI engine.
        </p>
      </header>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-[60vh] gap-8 w-full">
           <div className="relative w-24 h-24">
             {/* Outer Ring */}
             <motion.div 
               className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary"
               animate={{ rotate: 360 }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             />
             {/* Inner Ring */}
             <motion.div 
               className="absolute inset-2 rounded-full border-2 border-secondary/30 border-b-secondary"
               animate={{ rotate: -360 }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             />
             {/* Central Pulse */}
             <motion.div 
               className="absolute inset-[30%] bg-neon-purple/50 rounded-full blur-sm"
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
             />
           </div>
           
           <div className="flex flex-col items-center gap-2">
             <motion.h3 
                className="text-xl font-mono text-primary tracking-widest"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
             >
               INITIALIZING...
             </motion.h3>
             <div className="flex gap-1 h-1">
               {[...Array(3)].map((_, i) => (
                 <motion.div
                   key={i}
                   className="w-8 h-full bg-secondary"
                   initial={{ scaleX: 0 }}
                   animate={{ scaleX: 1 }}
                   transition={{ 
                     duration: 0.5, 
                     repeat: Infinity, 
                     delay: i * 0.2,
                     repeatDelay: 1 
                   }}
                 />
               ))}
             </div>
           </div>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl"
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
    </div>
  );
};

export default Dashboard;
