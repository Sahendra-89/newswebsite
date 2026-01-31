import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
// Link removed as it is no longer used
import { getNews, getVideos, getSettings } from "../services/api";
import ArticleCard from "../components/ArticleCard";

import AdSense from "../components/AdSense";

import { Article, Video, VideoSettings } from "../types";

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [settings, setSettings] = useState<VideoSettings>({
    channelName: "ShotNsense News",
    channelUrl: "https://www.youtube.com/@ShortsNsence",
    channelSubscribers: "1.2M Subscribers",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [newsRes, videoRes, settingsRes] = await Promise.all([
          getNews({ lang: i18n.language?.split('-')[0] || 'en' }),
          getVideos(),
          getSettings(),
        ]);
        setArticles(newsRes.data);
        setVideos(videoRes.data);
        if (settingsRes.data && Object.keys(settingsRes.data).length > 0) {
          setSettings((prev) => ({ ...prev, ...settingsRes.data }));
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [i18n.language]);

  // Featured Carousel Logic
  const featuredArticles = articles.filter((a) => a.featured).slice(0, 5); // Top 5 featured
  // Fallback if no featured articles: take latest 3
  const carouselArticles =
    featuredArticles.length > 0 ? featuredArticles : articles.slice(0, 3);

  // Show all articles in "Latest News" grid even if they are in top carousel, to ensure content visibility
  const otherArticles = articles;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused && carouselArticles.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselArticles.length);
      }, 5000); // 5 seconds
      return () => clearInterval(interval);
    }
  }, [isPaused, carouselArticles.length]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">
        Loading Latest News...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-2 md:pt-4">
      <Helmet>
        <title>ShotNsense News | News • Truth • Action</title>
        <meta name="description" content="Stay updated with the latest news, trending stories, and in-depth analysis from ShotNSENSE." />
        <meta property="og:title" content="ShotNSENSE | News • Truth • Action" />
        <meta property="og:description" content="Stay updated with the latest news, trending stories, and in-depth analysis from ShotNSENSE." />
        <meta property="og:image" content={`${window.location.origin}/og-logo.png`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* AdSense Top Banner */}
      <div className="mb-4 flex justify-center hidden">
        <AdSense slot="1234567890" style={{ display: 'block', width: '100%', maxWidth: '728px', height: '90px' }} />
      </div>

      {/* Featured Carousel Section */}
      {carouselArticles.length > 0 && (
        <section
          className="mb-24 relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center">
            <span className="w-1.5 h-6 md:w-2 md:h-8 bg-brand-600 rounded-full mr-3"></span>
            {t('home.trending')}
          </h2>

          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-xl">
            {carouselArticles.map((article, index) => (
              <div
                key={article._id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              >
                <ArticleCard article={article} featured={true} />
              </div>
            ))}

            {/* Carousel Indicators */}
            {carouselArticles.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
                {carouselArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentSlide
                      ? "bg-brand-600"
                      : "bg-white/50 hover:bg-white"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Navigation Arrows */}
            {carouselArticles.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentSlide(
                      (prev) =>
                        (prev - 1 + carouselArticles.length) %
                        carouselArticles.length,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide(
                      (prev) => (prev + 1) % carouselArticles.length,
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {/* Sections removed as per user request to not show category-wise lists on homepage */}

      {/* Video & Channel Section */}
      <section
        id="videos"
        className="mb-20 bg-gray-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="max-w-7xl mx-auto">
          {/* Channel Branding */}
          <div className="flex items-center justify-between mb-10">
            <a
              href={settings.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 group"
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                {settings.channelName.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors">
                  {settings.channelName}
                </h2>
                <p className="text-gray-400 text-sm">
                  Official Channel •{" "}
                  {settings.channelSubscribers || settings.channelSubscribers}
                </p>
              </div>
            </a>
            <a
              href={settings.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <span>Subscribe</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
          </div>

          {/* Dynamic Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.slice(0, 3).map((video) => {
              // Robust YouTube ID extraction
              const getYouTubeId = (url: string) => {
                const regExp =
                  /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                const match = url.match(regExp);
                return match && match[2].length === 11 ? match[2] : null;
              };
              const videoId = getYouTubeId(video.url);

              return (
                <a
                  key={video._id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                    <img
                      src={
                        videoId
                          ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                          : "https://via.placeholder.com/320x180?text=No+Thumbnail"
                      }
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* Duration Placeholder (since API doesn't have it yet) */}
                    {/* <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">12:45</div> */}
                  </div>
                  <h3 className="text-white font-bold text-lg leading-tight group-hover:text-red-500 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {video.views} •{" "}
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </a>
              );
            })}
            {videos.length === 0 && (
              <div className="text-gray-400 text-center col-span-3 py-10 bg-black/20 rounded-xl border border-gray-800 px-4">
                <p className="text-base md:text-lg font-medium text-white mb-2">
                  No Videos Available
                </p>
                <p className="text-xs md:text-sm">
                  Stay tuned for the latest video updates coming soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Advertising Banner Section */}
      {settings.adBannerImage && (
        <section className="mb-20">
          <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <a
              href={settings.adBannerUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative"
            >
              <img
                src={settings.adBannerImage}
                alt="Advertisement"
                className="w-full h-auto object-cover max-h-[200px] md:max-h-[300px]"
              />
              <div className="absolute top-2 right-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-widest backdrop-blur-sm">
                Ad
              </div>
            </a>
          </div>
        </section>
      )}

      {/* Latest News Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <span className="w-2 h-8 bg-brand-600 rounded-full mr-3"></span>
          {t('home.latest_news')}
        </h2>
        {otherArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {otherArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            No articles found.
          </div>
        )}
      </section>


    </div>
  );
};

export default HomePage;
