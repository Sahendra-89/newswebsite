import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getNews } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { Search as SearchIcon, TrendingUp } from 'lucide-react';
import { Article } from '../types';

const SearchResultsPage = () => {
    const { i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const pageStr = searchParams.get('page');
    const page = pageStr ? parseInt(pageStr) || 1 : 1;
    const [results, setResults] = useState<Article[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            window.scrollTo(0, 0);
            try {
                const res = await getNews({ search: query, page, limit: 12, lang: i18n.language?.split('-')[0] || 'en' });
                if (res.data.data) {
                    setResults(res.data.data);
                    setTotalPages(res.data.totalPages);
                    setTotalItems(res.data.totalItems);
                } else {
                    setResults(res.data);
                    setTotalItems(res.data.length);
                }
                setLoading(false);
            } catch (err) {
                console.error("Search failed", err);
                setLoading(false);
            }
        };
        fetchResults();
    }, [query, page, i18n.language]);

    const handlePageChange = (newPage: number) => {
        setSearchParams({ q: query, page: newPage.toString() });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search Header */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-brand-600/10 rounded-2xl">
                            <SearchIcon className="w-6 h-6 text-brand-600" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Search Intelligence</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
                        Results for <span className="text-brand-600 italic">"{query}"</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Found {totalItems} articles matching your criteria.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Results Grid */}
                    <div className="lg:col-span-8">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="animate-pulse bg-white rounded-2xl h-80"></div>
                                ))}
                            </div>
                        ) : results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {results.map(article => (
                                    <ArticleCard key={article._id} article={article} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                                <SearchIcon className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-gray-900 mb-2">No Matching Stories</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Try broadening your search terms or exploring our top categories.</p>
                                <button onClick={() => window.history.back()} className="px-8 py-3 bg-gray-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-600 transition-all">Go Back</button>
                            </div>
                        )}

                        {/* Pagination Bar */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center space-x-3">
                                <button
                                    disabled={page === 1}
                                    onClick={() => handlePageChange(page - 1)}
                                    className="px-6 py-3 bg-white border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50 hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    Previous
                                </button>
                                <div className="flex space-x-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${page === i + 1 ? 'bg-brand-600 text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => handlePageChange(page + 1)}
                                    className="px-6 py-3 bg-white border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50 hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Suggestions */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tighter flex items-center">
                                <TrendingUp className="w-5 h-5 text-brand-600 mr-2" />
                                Popular Topics
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['Elections', 'Crypto', 'World Cup', 'AI', 'Health', 'Global Economy'].map(tag => (
                                    <button key={tag} className="px-4 py-2 bg-gray-50 hover:bg-brand-600 hover:text-white rounded-xl text-xs font-bold text-gray-600 transition-all border border-gray-100">
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-brand-600/20">
                            <h3 className="text-xl font-black mb-4 tracking-tighter leading-tight">Insightful News, Delivered Free.</h3>
                            <p className="text-white/70 text-sm mb-8">Join 50,000+ readers who start their day with Sahendra News Intelligence.</p>
                            <input type="email" placeholder="Your work email" className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-sm focus:outline-none mb-4 placeholder:text-white/40" />
                            <button className="w-full bg-white text-brand-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Subscribe Now</button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default SearchResultsPage;
