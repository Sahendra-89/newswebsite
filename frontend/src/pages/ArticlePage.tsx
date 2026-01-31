import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { getNewsById, getNews } from "../services/api";
import {
  Calendar,
  User,
  Clock,
  Share2,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Twitter,
  Facebook,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import ArticleCard from "../components/ArticleCard";
import AdSense from "../components/AdSense";
import { Article } from "../types";

const getImageUrl = (imagePath: string | undefined) => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith("/uploads")) {
    return `http://localhost:5000${imagePath}`;
  }
  return imagePath;
};

const ArticlePage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedNews, setRelatedNews] = useState<Article[]>([]);
  const [trendingNews, setTrendingNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleData = async () => {
      if (!id) return;
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await getNewsById(id);
        const art = res.data;
        setArticle(art);

        // Fetch Related News (same category, UI language)
        const relatedRes = await getNews({ category: art.category, lang: i18n.language?.split('-')[0] || 'en' });
        setRelatedNews((relatedRes.data as Article[]).filter((a) => a._id !== id).slice(0, 3));

        // Fetch Trending News (latest, UI language)
        const trendingRes = await getNews({ lang: i18n.language?.split('-')[0] || 'en' });
        setTrendingNews((trendingRes.data as Article[]).slice(0, 5));

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch article data", err);
        setError("Article not found or server error.");
        setLoading(false);
      }
    };
    fetchArticleData();
  }, [id, i18n.language]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-red-500 font-bold">{error}</div>
    );
  if (!article) return null;

  const articleUrl = window.location.href;
  const shareOnWhatsApp = () => {
    const text = `*${article.title}*\n\nRead more at: ${articleUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareOnTwitter = () => {
    const text = `Check out this news: ${article.title}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(articleUrl)}`,
      "_blank",
    );
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
      "_blank",
    );
  };

  return (
    <article className="bg-white min-h-screen">
      <Helmet>
        <title>{article.metaTitle || article.title} | ShotNsense News</title>
        <meta
          name="description"
          content={
            article.metaDescription || article.excerpt || "Read the latest stories on ShotNsense News."
          }
        />
        {article.keywords && <meta name="keywords" content={article.keywords} />}
        <meta property="og:title" content={article.metaTitle || article.title} />
        <meta property="og:description" content={article.metaDescription || article.excerpt} />
        <meta property="og:image" content={getImageUrl(article.image) || `${window.location.origin}/og-logo.png`} />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Article Header (Masthead) */}
      <div className="relative h-[50vh] md:h-[70vh] min-h-[400px] w-full">
        {article.image && (
          <img
            src={getImageUrl(article.image)}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 text-white">
          <div className="max-w-7xl mx-auto">
            <Link
              to={`/category/${article.category}`}
              className="inline-block px-3 py-1 mb-4 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase bg-brand-600 text-white rounded-lg hover:bg-white hover:text-brand-600 transition-all shadow-xl shadow-brand-600/20"
            >
              {article.category}
            </Link>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-black mb-6 leading-[1.2] md:leading-[1.1] max-w-5xl tracking-tighter">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-[10px] md:text-sm font-bold text-gray-100 uppercase tracking-widest">
              <div className="flex items-center space-x-2 md:space-x-3">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-brand-500" />
                <span>{new Date(article.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-brand-500" />
                <span>6 min read</span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3">
                <User className="w-4 h-4 md:w-5 md:h-5 text-brand-500" />
                <span>By Staff Reporter</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          {/* Main Column */}
          <div className="lg:col-span-8 min-w-0">
            <div className="prose prose-lg md:prose-xl prose-slate max-w-none text-gray-800 leading-relaxed font-serif break-words">
              <div
                className="rich-text-content first-letter:text-6xl md:first-letter:text-7xl first-letter:font-black first-letter:text-brand-600 first-letter:mr-3 first-letter:float-left line-height-2"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            {/* Article Bottom Ad */}
            <div className="mb-12 border-t border-b border-gray-100 py-8">
              <AdSense slot="9876543210" format="fluid" layoutKey="-fb+5w+4e-db+86" />
            </div>

            {/* Engagement Bar */}
            <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap gap-2">
                {[article.category, "Featured", "World News"].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 bg-gray-50 text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest border border-gray-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={shareOnWhatsApp}
                  className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                  title="Share on WhatsApp"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={shareOnTwitter}
                  className="p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20"
                  title="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={shareOnFacebook}
                  className="p-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/20"
                  title="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(articleUrl);
                    alert(t('article.link_copied'));
                  }}
                  className="p-3 bg-gray-50 text-gray-400 hover:text-brand-600 rounded-xl border border-gray-100 transition-all"
                  title="Copy Link"
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Related News Section */}
            {relatedNews.length > 0 && (
              <div className="mt-24">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center">
                    <span className="w-2 h-8 bg-brand-600 rounded-full mr-4"></span>
                    {t('article.related_stories')}
                  </h2>
                  <Link
                    to={`/category/${article.category}`}
                    className="text-brand-600 font-bold flex items-center space-x-1 hover:underline"
                  >
                    <span>{t('article.view_grid')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedNews.map((a) => (
                    <ArticleCard key={a._id} article={a} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12 sticky top-24 self-start">
            {/* Trending Now */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tighter flex items-center">
                <TrendingUp className="w-5 h-5 text-brand-600 mr-2" />
                Trending Now
              </h3>
              <div className="space-y-6">
                {trendingNews.map((t, idx) => (
                  <Link
                    key={t._id}
                    to={`/article/${t._id}`}
                    className="flex space-x-4 items-start group"
                  >
                    <span className="text-3xl font-black text-gray-200 group-hover:text-brand-500 transition-colors">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-tight">
                        {t.title}
                      </h4>
                      <span className="text-[10px] uppercase font-black text-gray-400 mt-2 block tracking-widest">
                        {t.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Advertisement */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-center text-gray-400 mb-2 uppercase tracking-widest">Advertisement</p>
              <AdSense slot="5432109876" style={{ display: 'block', minHeight: '250px' }} />
            </div>

            {/* Newsletter */}
            <div className="p-8 rounded-3xl bg-zinc-900 text-white">
              <h3 className="text-xl font-black mb-4 tracking-tighter">
                The Morning Edition
              </h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Stay ahead of the curve with our curated daily newsletter. No
                spam, just pure journalism.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-brand-600 focus:outline-none transition-all placeholder:text-gray-600"
                />
                <button className="w-full bg-brand-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-600/20 hover:bg-brand-700 transition-all">
                  Sign Up Now
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
};

export default ArticlePage;
