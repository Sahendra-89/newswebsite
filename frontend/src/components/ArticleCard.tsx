import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Article } from '../types';

const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60'; // Default fallback
    if (imagePath.startsWith('/uploads')) {
        return `http://localhost:5000${imagePath}`;
    }
    return imagePath;
};

interface ArticleCardProps {
    article: Article;
    featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
    if (featured) {
        return (
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="absolute inset-0">
                    <img
                        src={getImageUrl(article.image || article.imageUrl)}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90" />
                </div>
                <div className="relative p-6 md:p-8 h-full flex flex-col justify-end text-white">
                    <span className="inline-block px-3 py-1 mb-3 md:mb-4 text-[10px] md:text-xs font-semibold tracking-wider uppercase bg-brand-600 rounded-full w-fit">
                        {article.category}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-display font-bold mb-3 md:mb-4 leading-tight group-hover:text-brand-300 transition-colors">
                        <Link to={`/article/${article._id}`}>
                            {article.title}
                        </Link>
                    </h2>
                    <p className="text-gray-300 mb-4 md:mb-6 max-w-2xl text-base md:text-lg line-clamp-2">
                        {article.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 md:space-x-6 text-[10px] md:text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                            <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>Editor</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>{new Date(article.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // The previous unreachable return block is removed as per the instruction's implied change.

    return (
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={getImageUrl(article.image || article.imageUrl)}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-white/95 backdrop-blur-sm text-gray-900 rounded-full shadow-sm">
                        {article.category}
                    </span>
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-2 leading-snug group-hover:text-brand-600 transition-colors">
                    <Link to={`/article/${article._id}`}>
                        {article.title}
                    </Link>
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                    {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <span className="text-xs font-medium text-gray-500">By Admin</span>
                    <Link to={`/article/${article._id}`} className="flex items-center text-brand-600 text-sm font-semibold hover:text-brand-700 transition-colors">
                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
