import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, Sparkles, User, Calendar } from 'lucide-react';
import Markdown from 'react-markdown';

const ComparisonModal = ({ article, onClose }) => {
  // Simple heuristic to extract metadata from original content
  const extractMetadata = (content) => {
    if (!content) return { author: 'Unknown Author', date: new Date().toLocaleDateString() };
    
    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    // Assuming format: Title / Author / Date
    // Heuristic: Check if line 2 (index 1) is a date, if so line 1 is Author? 
    // Or based on user sample: Line 0: Title, Line 1: Author, Line 2: Date
    
    let author = 'AI Editor';
    let date = new Date(article.updatedAt || Date.now()).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    if (lines.length >= 3) {
      // Very basic check for a date structure in the 3rd line (index 2)
      const dateLine = lines[2];
      const authorLine = lines[1];
      
      if (dateLine.match(/[a-zA-Z]+ \d{1,2}, \d{4}/)) {
        date = dateLine;
        author = authorLine;
      }
    }
    
    return { author, date };
  };

  const { author, date } = extractMetadata(article.original_content);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          layoutId={`card-${article._id}`}
          className="glass-modal w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>

          {/* Header for Mobile */}
          <div className="md:hidden p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white truncate pr-8">{article.title}</h2>
          </div>

          {/* Original Content (Left) */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-black/20 relative group">
            <div className="sticky top-0 z-10 flex items-center gap-2 mb-6 pointer-events-none">
              <span className="bg-gray-800/50 backdrop-blur-md text-gray-300 px-3 py-1 rounded-full text-sm font-medium border border-white/5">
                Original Draft
              </span>
            </div>
            <div className="prose prose-invert prose-p:text-gray-400 max-w-none">
              <p className="whitespace-pre-wrap">{article.original_content}</p>
            </div>
            
            {/* Divider Gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block" />
          </div>

          {/* Center Divider Icon */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-black/50 border border-t-primary/50 border-white/10 backdrop-blur-xl shadow-lg shadow-primary/20">
             <ArrowRightLeft size={20} className="text-primary" />
          </div>

          {/* AI Enhanced Content (Right) */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-gradient-to-br from-primary/5 to-transparent relative">
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center justify-between pb-4">
                  <span className="bg-primary/10 backdrop-blur-md text-primary-300 px-3 py-1 rounded-full text-sm font-medium border border-primary/20 flex items-center gap-2 shadow-[0_0_15px_rgba(109,40,217,0.3)]">
                    <Sparkles size={14} />
                    AI Enhanced
                  </span>
              </div>
              
              {/* Metadata - Simple Text */}
              <div className="flex items-center gap-6 text-sm text-gray-400 pl-1">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-neon-purple" />
                  <span className="font-medium text-gray-300">{author}</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-neon-blue" />
                  <span>{date}</span>
                </div>
              </div>
            </div>

             {article.updated_content ? (
                <div className="prose prose-invert prose-headings:text-white prose-p:text-gray-200 prose-a:text-neon-blue max-w-none">
                  <Markdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary mb-6" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-white mt-8 mb-4 flex items-center gap-2 after:h-px after:flex-1 after:bg-white/10" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-medium text-neon-blue mt-6 mb-3" {...props} />,
                      p: ({node, ...props}) => <p className="leading-7 text-gray-300 mb-4" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 space-y-2 text-gray-300 mb-4 marker:text-primary" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 space-y-2 text-gray-300 mb-4 marker:text-primary" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 italic text-gray-400 bg-white/5 rounded-r-lg" {...props} />,
                      a: ({node, ...props}) => <a className="text-neon-blue hover:text-neon-purple transition-colors underline underline-offset-4" {...props} />,
                      code: ({node, ...props}) => <code className="bg-black/30 text-neon-purple px-1.5 py-0.5 rounded text-sm font-mono border border-white/5" {...props} />,
                    }}
                  >
                    {article.updated_content}
                  </Markdown>
                </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 opacity-50">
                 <Sparkles size={48} className="animate-pulse" />
                 <p>AI enhancement pending...</p>
               </div>
             )}
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComparisonModal;
