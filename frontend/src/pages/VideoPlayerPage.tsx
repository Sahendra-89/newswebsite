import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSettings, getVideoById, getVideos } from '../services/api';

const VideoPlayerPage = () => {
    const { id } = useParams();
    const [video, setVideo] = useState<any>(null);
    const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
    const [settings, setSettings] = useState({
        channelName: 'Sahendra News TV',
        channelUrl: 'https://www.youtube.com/@SahendraNewsTV',
        channelSubscribers: '1.2M Subscribers'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchVideoData = async () => {
            setLoading(true);
            try {
                const [videoRes, allVideosRes, settingsRes] = await Promise.all([
                    getVideoById(id),
                    getVideos(),
                    getSettings()
                ]);

                setVideo(videoRes.data);
                setRelatedVideos(allVideosRes.data);

                if (settingsRes.data && Object.keys(settingsRes.data).length > 0) {
                    setSettings(prev => ({ ...prev, ...settingsRes.data }));
                }
            } catch (err) {
                console.error("Error fetching video data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideoData();
        window.scrollTo(0, 0); // Scroll to top on video change
    }, [id]);

    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col bg-white">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Video Not Found</h2>
                <Link to="/" className="text-red-600 font-bold hover:underline">Back to Home</Link>
            </div>
        );
    }

    const currentVideoId = getYouTubeId(video.url);
    const embedUrl = currentVideoId ? `https://www.youtube.com/embed/${currentVideoId}?autoplay=1` : video.url;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg mb-6">
                        <iframe
                            width="100%"
                            height="100%"
                            src={embedUrl}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                        <div className="text-gray-600 text-sm">
                            {video.views} • {new Date(video.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-4">
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                                <span>Like</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                <span>Share</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-center space-x-4 mb-4">
                            <a href={settings.channelUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white text-lg font-bold group-hover:scale-110 transition-transform">
                                    {settings.channelName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">{settings.channelName}</h3>
                                    <p className="text-gray-500 text-xs">{settings.channelSubscribers}</p>
                                </div>
                            </a>
                            <a
                                href={settings.channelUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800"
                            >
                                Subscribe
                            </a>
                        </div>
                        <p className="text-gray-700 whitespace-pre-line">
                            {video.description}
                        </p>
                    </div>

                    {/* Comments Section Placeholder */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Comments</h3>
                        <div className="border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                            Comments are disabled for this preview.
                        </div>
                    </div>
                </div>

                {/* Sidebar Recommendations */}
                <div className="lg:col-span-1">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Up Next</h3>
                    <div className="space-y-4">
                        {relatedVideos.filter(v => v._id !== id).map((v) => {
                            const relatedVideoId = getYouTubeId(v.url);

                            return (
                                <Link key={v._id} to={`/video/${v._id}`} className="flex space-x-3 group cursor-pointer">
                                    <div className="relative w-40 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={relatedVideoId ? `https://img.youtube.com/vi/${relatedVideoId}/mqdefault.jpg` : 'https://via.placeholder.com/160x90?text=No+Thumb'}
                                            alt={v.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
                                            {v.title}
                                        </h4>
                                        <p className="text-gray-500 text-xs mt-1">{settings.channelName}</p>
                                        <p className="text-gray-500 text-xs">{v.views}</p>
                                    </div>
                                </Link>
                            );
                        })}
                        {relatedVideos.length <= 1 && (
                            <p className="text-gray-500 text-sm italic">No other videos available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;
