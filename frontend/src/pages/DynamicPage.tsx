import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPageBySlug } from '../services/api'; // We need to update api.ts first? I did in previous step.
import { Page } from '../types';

interface DynamicPageProps {
    slug?: string; // If passed as prop (e.g., for /about)
}

const DynamicPage: React.FC<DynamicPageProps> = ({ slug: propSlug }) => {
    const { slug: paramSlug } = useParams();
    const slug = propSlug || paramSlug;
    const [page, setPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPage = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const res = await getPageBySlug(slug);
                setPage(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch page", err);
                setError('Page not found');
                setLoading(false);
            }
        };
        fetchPage();
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div></div>;
    if (error || !page) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{error || 'Page not found'}</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
            <Helmet>
                <title>{page.title} | ShotNsense News</title>
                <meta name="description" content={page.metaDescription || `${page.title} - ShotNsense News`} />
            </Helmet>

            <h1 className="text-4xl md:text-5xl font-display font-black text-gray-900 mb-8 text-center">{page.title}</h1>

            <div className="prose prose-lg prose-slate max-w-none bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
        </div>
    );
};

export default DynamicPage;
