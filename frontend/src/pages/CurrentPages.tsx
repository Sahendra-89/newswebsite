import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import { getNews } from '../services/api';
import { Article } from '../types';

const CurrentPages = () => {
    const { i18n } = useTranslation();
    const [currentNews, setCurrentNews] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await getNews({ lang: i18n.language });
                // API returns Article[] directly usually
                setCurrentNews(res.data);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [i18n.language]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <p className="text-xl text-gray-600">Loading News...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span className="w-2 h-10 bg-brand-600 rounded-full mr-4"></span>
                    Current News
                </h1>
                <p className="mt-4 text-gray-600 ml-6">
                    Stay updated with the latest happenings and breaking news.
                </p>
            </div>

            {currentNews.length === 0 ? (
                <div className="text-center text-gray-500 py-10">No news available at the moment.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentNews.map((article) => (
                        <ArticleCard key={article._id} article={article} />
                    ))}
                </div>
            )}

            <Pagination />
        </div>
    );
};

export default CurrentPages;