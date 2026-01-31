import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { getNews } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import AdSense from '../components/AdSense';
import { Article } from '../types';

const CategoryPage = () => {
    const { "*": slug } = useParams();
    const decodedSlug = decodeURIComponent(slug || "");
    const { i18n } = useTranslation();
    const [categoryArticles, setCategoryArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryNews = async () => {
            setLoading(true);
            try {
                // Fetch articles filtered by decoded category name and current language
                const res = await getNews({ category: decodedSlug, lang: i18n.language?.split('-')[0] || 'en' });
                setCategoryArticles(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch category news", err);
                setLoading(false);
            }
        };
        fetchCategoryNews();
    }, [decodedSlug, i18n.language]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Helmet>
                <title>{slug} News | ShotNsense News</title>
                <meta name="description" content={`Latest news and updates from ${slug}.`} />
                <meta property="og:title" content={`${slug} News | ShotNsense News`} />
                <meta property="og:description" content={`Explore the latest stories in ${slug}.`} />
                <meta property="og:image" content={`${window.location.origin}/og-logo.png`} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
            </Helmet>

            <div className="text-center mb-16">
                <span className="text-brand-600 font-semibold tracking-wider uppercase text-sm">Category</span>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mt-2">
                    {slug}
                </h1>
                <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                    Explore the latest stories in {slug}.
                </p>
                <div className="mt-8 border-b border-gray-100 max-w-xs mx-auto"></div>
            </div>

            {loading ? (
                <div className="min-h-[400px] flex items-center justify-center text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mr-3"></div>
                    Loading stories...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {categoryArticles.length > 0 ? (
                        categoryArticles.map((article) => (
                            <ArticleCard key={article._id} article={article} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Stories Available</h3>
                            <p className="text-gray-500">We haven't published any news in "{slug}" yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            )}



            {/* Category Bottom Ad */}
            <div className="mt-16 mb-8">
                <AdSense slot="1122334455" format="auto" responsive="true" />
            </div>

            {categoryArticles.length > 9 && <Pagination />}
        </div>
    );
};

export default CategoryPage;
