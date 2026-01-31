import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
    getNews, createNews, updateNews, deleteNews,
    getAdmins, registerAdmin, deleteAdmin,
    getVideos, createVideo, deleteVideo,
    getCategories, createCategory, deleteCategory,
    getSettings, updateSettings,
    getPages, createPage, updatePage, deletePage,
    translateText
} from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Video as VideoIcon,
    Layers, Settings as SettingsIcon, Users, LogOut,
    Bell, Search, Menu, X
} from 'lucide-react';




import { Article, User, Video, Category, VideoSettings, Page } from '../types';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('news');
    const [news, setNews] = useState<Article[]>([]);
    const [admins, setAdmins] = useState<User[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [pages, setPages] = useState<Page[]>([]); // Dynamic Pages
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Constants (Dynamic from DB now)
    const [dbCategories, setDbCategories] = useState<string[]>([]);

    // Forms
    const [newsForm, setNewsForm] = useState<any>({
        title: '', content: '', category: 'General', language: 'en',

        featured: false, autoTranslate: false, image: null, date: new Date().toISOString().split('T')[0],
        // SEO Fields
        slug: '', metaTitle: '', metaDescription: '', keywords: ''
    });
    const [pageForm, setPageForm] = useState({ title: '', slug: '', content: '', metaDescription: '' });
    const [editingPageId, setEditingPageId] = useState<string | null>(null);

    const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] = useState('All');
    const [adminForm, setAdminForm] = useState({ username: '', password: '' });
    const [videoForm, setVideoForm] = useState({ title: '', url: '', description: '' });
    const [categoryForm, setCategoryForm] = useState({ name: '' });

    // Settings Form
    const [settings, setSettings] = useState<VideoSettings>({
        channelName: 'Sahendra News TV',
        channelUrl: 'https://www.youtube.com/@SahendraNewsTV',
        channelSubscribers: '1.2M Subscribers'
    });

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [newsRes, adminsRes, videosRes, categoriesRes, settingsRes, pagesRes] = await Promise.all([
                getNews({ page, limit: 10, search: searchTerm, category: filterCategory }),
                getAdmins(),
                getVideos(),
                getCategories(),
                getSettings(),
                getPages()
            ]);

            if (newsRes.data.data) {
                setNews(newsRes.data.data);
                setTotalPages(newsRes.data.totalPages);
            } else {
                setNews(newsRes.data);
            }

            setAdmins(adminsRes.data);
            setVideos(videosRes.data);
            setCategories(categoriesRes.data);
            setPages(pagesRes.data);

            const catNames = categoriesRes.data.map((c: any) => c.name);
            setDbCategories(catNames.length > 0 ? catNames : ['General']);

            if (settingsRes.data && Object.keys(settingsRes.data).length > 0) {
                setSettings(prev => ({ ...prev, ...settingsRes.data }));
            }

            setLoading(false);
        } catch (err) {
            console.error(err);
            showFeedback('Failed to load data.', 'error');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, searchTerm, filterCategory]);

    const showFeedback = (message: string, type: string) => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
    };

    // ... (handlers handled in previous step) - RESTORING
    const handleNewsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Handle checkbox separately
        if (e.target.type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setNewsForm({ ...newsForm, [name]: checked });
        } else {
            setNewsForm({ ...newsForm, [name]: value });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewsForm({ ...newsForm, image: e.target.files[0] });
        }
    };

    const handleContentChange = (content: string) => {
        setNewsForm({ ...newsForm, content });
    };

    const handleNewsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newsForm).forEach(key => {
            if (key === 'image' && !newsForm.image) return;
            if (key === 'autoTranslate') return; // Don't send this to backend
            formData.append(key, newsForm[key]);
        });

        try {
            if (editingNewsId) {
                await updateNews(editingNewsId, formData);
                showFeedback('Article updated!', 'success');
                setEditingNewsId(null);
            } else {
                await createNews(formData);
                let message = 'Article created!';

                // Handle Auto-Translation
                if (newsForm.autoTranslate && newsForm.language === 'en') {
                    showFeedback('Article created! Translating...', 'success');
                    try {
                        const transRes = await translateText({
                            title: newsForm.title,
                            content: newsForm.content,
                            targetLang: 'hi'
                        });

                        const translatedFormData = new FormData();
                        translatedFormData.append('title', transRes.data.title);
                        translatedFormData.append('content', transRes.data.content);
                        translatedFormData.append('category', newsForm.category);
                        translatedFormData.append('language', 'hi');
                        translatedFormData.append('featured', newsForm.featured.toString());
                        translatedFormData.append('date', newsForm.date);
                        if (newsForm.image) translatedFormData.append('image', newsForm.image);

                        await createNews(translatedFormData);
                        message = 'Article and Hindi Translation created!';
                    } catch (transErr) {
                        console.error('Auto-translation failed', transErr);
                        message = 'Article created, but auto-translation failed.';
                    }
                }
                showFeedback(message, 'success');
            }

            setNewsForm({
                title: '', content: '', category: dbCategories[0] || 'General', language: 'en',
                featured: false, autoTranslate: false, image: null, date: new Date().toISOString().split('T')[0],
                slug: '', metaTitle: '', metaDescription: '', keywords: ''
            });
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            const res = await getNews();
            setNews(res.data);
        } catch (err: any) {
            console.error('Submit Error:', err);
            const errMsg = err.response?.data?.msg || err.message || 'Error saving article.';
            showFeedback(errMsg, 'error');
        }
    };

    const handleEditNews = (article: Article) => {
        setNewsForm({
            ...article,
            image: null,
            category: article.category || (dbCategories[0] || 'General'),
            slug: article.slug || '',
            metaTitle: article.metaTitle || '',
            metaDescription: article.metaDescription || '',
            keywords: article.keywords || ''
        });
        setEditingNewsId(article._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteNews = async (id: string) => {
        if (window.confirm('Delete article?')) {
            try {
                await deleteNews(id);
                const res = await getNews();
                setNews(res.data);
                showFeedback('Deleted!', 'success');
            } catch (err) {
                showFeedback('Error deleting.', 'error');
            }
        }
    };

    const handleTranslate = async (article: Article) => {
        if (!window.confirm(`Translate "${article.title}" to Hindi?`)) return;
        setLoading(true);
        try {
            const res = await translateText({
                title: article.title,
                content: article.content,
                targetLang: 'hi'
            });

            setNewsForm({
                title: res.data.title,
                content: res.data.content,
                category: article.category,
                language: 'hi', // Set target language
                featured: article.featured,
                image: article.image, // Keep same image
                date: new Date().toISOString().split('T')[0]
            });

            setEditingNewsId(null); // Ensure it creates a NEW article
            setActiveTab('news'); // Switch to form
            showFeedback('Content translated! Review and Publish.', 'success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error(err);
            showFeedback('Translation failed.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleVideoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createVideo(videoForm);
            showFeedback('Video added!', 'success');
            setVideoForm({ title: '', url: '', description: '' });
            const res = await getVideos();
            setVideos(res.data);
        } catch (err: any) {
            const msg = err.response?.data?.msg || 'Error adding video.';
            showFeedback(msg, 'error');
        }
    };

    const handleDeleteVideo = async (id: string) => {
        if (window.confirm('Delete video?')) {
            try {
                await deleteVideo(id);
                const res = await getVideos();
                setVideos(res.data);
                showFeedback('Video deleted.', 'success');
            } catch (err) { showFeedback('Error deleting.', 'error'); }
        }
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCategory(categoryForm);
            showFeedback('Category added!', 'success');
            setCategoryForm({ name: '' });
            const res = await getCategories();
            setCategories(res.data);
            setDbCategories(res.data.map((c: any) => c.name));
        } catch (err) { showFeedback('Error adding category.', 'error'); }
    };

    const handleDeleteCategory = async (id: string) => {
        if (window.confirm('Delete category?')) {
            try {
                await deleteCategory(id);
                const res = await getCategories();
                setCategories(res.data);
                setDbCategories(res.data.map((c: any) => c.name));
                showFeedback('Category deleted.', 'success');
            } catch (err) { showFeedback('Error deleting.', 'error'); }
        }
    };

    const handleAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerAdmin(adminForm);
            showFeedback('Admin added!', 'success');
            setAdminForm({ username: '', password: '' });
            const res = await getAdmins();
            setAdmins(res.data);
        } catch (err) { showFeedback('Error adding admin.', 'error'); }
    };

    const handleDeleteAdmin = async (id: string) => {
        if (window.confirm('Revoke access?')) {
            try {
                await deleteAdmin(id);
                const res = await getAdmins();
                setAdmins(res.data);
                showFeedback('Access revoked.', 'success');
            } catch (err) { showFeedback('Error revoking.', 'error'); }
        }
    };

    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateSettings(settings);
            showFeedback('Global settings updated!', 'success');
        } catch (err) {
            showFeedback('Error updating settings.', 'error');
        }
    };

    const handlePageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPageId) {
                await updatePage(editingPageId, pageForm);
                showFeedback('Page updated!', 'success');
                setEditingPageId(null);
            } else {
                await createPage(pageForm);
                showFeedback('Page created!', 'success');
            }
            setPageForm({ title: '', slug: '', content: '', metaDescription: '' });
            const res = await getPages();
            setPages(res.data);
        } catch (err: any) {
            showFeedback(err.response?.data?.msg || 'Error saving page.', 'error');
        }
    };

    const handleEditPage = (page: Page) => {
        setPageForm({ title: page.title, slug: page.slug, content: page.content, metaDescription: page.metaDescription || '' });
        setEditingPageId(page._id);
        setActiveTab('pages'); // Ensure tab is active although should be
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeletePage = async (id: string) => {
        if (window.confirm('Delete this page?')) {
            try {
                await deletePage(id);
                const res = await getPages();
                setPages(res.data);
                showFeedback('Page deleted.', 'success');
            } catch (err) { showFeedback('Error deleting page.', 'error'); }
        }
    };

    const handleLogout = () => { localStorage.removeItem('token'); navigate('/admin/login'); };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                <span className="ml-4">Loading Control Center...</span>
            </div>
        );
    }


    const navItems = [
        { id: 'news', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'videos', label: 'Videos', icon: VideoIcon },
        { id: 'categories', label: 'Categories', icon: Layers },
        { id: 'pages', label: 'Pages', icon: FileText },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
        ...(role === 'superadmin' ? [{ id: 'admins', label: 'Admins', icon: Users }] : [])
    ];

    return (
        <div className="min-h-screen bg-[#F5F6FA] flex font-sans">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1E1E2D] text-white transition-all duration-300 fixed h-full z-30 flex flex-col`}>
                <div className="h-16 flex items-center justify-center border-b border-gray-800">
                    {sidebarOpen ? (
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AdminPanel</h1>
                    ) : (
                        <span className="text-xl font-bold text-blue-500">AP</span>
                    )}
                </div>

                <nav className="flex-1 py-6 space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-6 py-3 transition-colors relative ${activeTab === item.id ? 'bg-[#1b1b28] text-blue-500' : 'text-gray-400 hover:text-gray-200 hover:bg-[#2A2A3C]'}`}
                        >
                            <item.icon size={20} className="min-w-[20px]" />
                            <span className={`ml-4 font-medium transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>{item.label}</span>
                            {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="flex items-center text-gray-400 hover:text-white transition-colors w-full">
                        <LogOut size={20} />
                        <span className={`ml-4 ${!sidebarOpen && 'hidden'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>

                {/* Header */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-20">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-4 text-gray-500 hover:text-gray-700">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 capitalize">{navItems.find(i => i.id === activeTab)?.label}</h2>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 w-64 outline-none"
                            />
                        </div>
                        <button className="relative text-gray-500 hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
                            <Bell size={20} />
                        </button>
                        <div className="flex items-center space-x-3 border-l pl-6">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">A</div>
                            <div className="hidden md:block">
                                <p className="text-sm font-bold text-gray-800">Admin User</p>
                                <p className="text-xs text-gray-500">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {feedback.message && (
                        <div className={`mb-6 p-4 rounded-lg shadow-sm flex items-center ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {feedback.message}
                        </div>
                    )}

                    {/* Welcome Banner & Stats */}
                    {activeTab === 'news' && (
                        <div>
                            <div className="bg-[#FFE2E5] rounded-2xl p-8 mb-8 flex items-center justify-between relative overflow-hidden">
                                <div className="relative z-10 w-2/3">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Hello Admin!</h2>
                                    <p className="text-gray-700">
                                        You have <span className="font-bold">{news.length}</span> published articles and <span className="font-bold">{admins.length}</span> active team members.
                                    </p>
                                    <button onClick={() => setEditingNewsId(null)} className="mt-6 bg-[#FA5A7D] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#d43d60] transition-colors shadow-lg shadow-pink-200">
                                        Write New Post
                                    </button>
                                </div>
                                <div className="hidden md:block relative z-10">
                                    <FileText size={140} className="text-[#FA5A7D] opacity-20 absolute -right-6 -bottom-10 rotate-12" />
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 font-medium mb-1">Total Articles</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{news.length}</h3>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                                        <FileText size={24} />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 font-medium mb-1">Total Videos</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{videos.length}</h3>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center">
                                        <VideoIcon size={24} />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 font-medium mb-1">Categories</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{categories.length}</h3>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                                        <Layers size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- News Tab --- */}
                    {activeTab === 'news' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold mb-8 flex items-center text-gray-800">
                                    <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
                                    {editingNewsId ? 'Edit Article' : 'Compose New Article'}
                                </h2>
                                <form onSubmit={handleNewsSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Article Title</label>
                                            <input type="text" name="title" placeholder="Enter a catchy headline..." value={newsForm.title} onChange={handleNewsChange} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Category</label>
                                            <select name="category" value={newsForm.category} onChange={handleNewsChange} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white">
                                                {dbCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Content Body</label>
                                        <div className="h-80 mb-12 bg-white rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
                                            <ReactQuill theme="snow" value={newsForm.content} onChange={handleContentChange} className="h-full border-none" modules={{ toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'image']] }} />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6 pt-6">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Featured Image</label>
                                            <input id="fileInput" type="file" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all border border-gray-200 rounded-xl" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Language</label>
                                            <select name="language" value={newsForm.language} onChange={handleNewsChange} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white">
                                                <option value="en">English</option>
                                                <option value="hi">Hindi</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Publish Date</label>
                                            <input type="date" name="date" value={newsForm.date} onChange={handleNewsChange} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm" />
                                        </div>
                                    </div>


                                    {/* SEO Section (Collapsible or just section) */}
                                    <div className="pt-6 mt-6 border-t border-gray-100">
                                        <h3 className="font-bold text-gray-800 mb-4 flex items-center text-sm uppercase tracking-wide">
                                            SEO Metadata <span className="ml-2 text-xs text-blue-500 normal-case px-2 py-0.5 bg-blue-50 rounded-full">Optional</span>
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Meta Title</label>
                                                <input type="text" name="metaTitle" placeholder="SEO Title (defaults to article title)" value={newsForm.metaTitle || ''} onChange={handleNewsChange} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Custom Slug</label>
                                                <input type="text" name="slug" placeholder="custom-url-slug" value={newsForm.slug || ''} onChange={handleNewsChange} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm" />
                                            </div>
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Meta Description</label>
                                                <input type="text" name="metaDescription" placeholder="Brief summary for search engines..." value={newsForm.metaDescription || ''} onChange={handleNewsChange} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm" />
                                            </div>
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Keywords</label>
                                                <input type="text" name="keywords" placeholder="comma, separated, keywords" value={newsForm.keywords || ''} onChange={handleNewsChange} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100">
                                        <div className="flex gap-6">
                                            <label className="flex items-center space-x-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newsForm.featured ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'}`}>
                                                    {newsForm.featured && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                                <input type="checkbox" name="featured" checked={newsForm.featured} onChange={handleNewsChange} className="hidden" />
                                                <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">Featured Post</span>
                                            </label>
                                            {!editingNewsId && newsForm.language === 'en' && (
                                                <label className="flex items-center space-x-3 cursor-pointer group">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newsForm.autoTranslate ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'}`}>
                                                        {newsForm.autoTranslate && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                    <input type="checkbox" name="autoTranslate" checked={newsForm.autoTranslate} onChange={handleNewsChange} className="hidden" />
                                                    <span className="text-sm font-medium text-gray-600 group-hover:text-orange-600 transition-colors">Auto-translate</span>
                                                </label>
                                            )}
                                        </div>
                                        <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transform active:scale-95 transition-all flex items-center">
                                            {editingNewsId ? 'Update Article' : 'Publish Article'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                                    <h2 className="font-bold text-lg text-gray-800">Recent Articles</h2>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
                                            <Search size={16} className="text-gray-400 mr-2" />
                                            <input
                                                type="text"
                                                placeholder="Search articles..."
                                                value={searchTerm}
                                                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                                className="bg-transparent border-none text-sm outline-none placeholder:text-gray-400 w-48"
                                            />
                                        </div>
                                        <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }} className="border border-gray-200 p-2 rounded-xl text-sm bg-white outline-none shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
                                            <option value="All">All Categories</option>
                                            {dbCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                                    {news.filter(a => filterCategory === 'All' || a.category === filterCategory).map(a => (
                                        <div key={a._id} className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-gray-50 transition-colors group">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                                                    {a.image ? (
                                                        <img src={a.image.startsWith('/uploads') ? `http://localhost:5000${a.image}` : a.image} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <FileText size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{a.title}</h3>
                                                    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">{a.category}</span>
                                                        <span>•</span>
                                                        <span>{new Date(a.date).toLocaleDateString()}</span>
                                                        {a.language === 'hi' && <span className="text-orange-500 font-bold">• Hindi Content</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 mt-4 md:mt-0 opacity-80 md:opacity-0 group-hover:opacity-100 transition-all">
                                                <Link to={`/article/${a._id}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Article">
                                                    <LayoutDashboard size={18} />
                                                </Link>
                                                {a.language === 'en' && (
                                                    <button onClick={() => handleTranslate(a)} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Translate to Hindi">
                                                        <Layers size={18} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleEditNews(a)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit Article">
                                                    <FileText size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteNews(a._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Article">
                                                    <LogOut size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {news.length === 0 && (
                                        <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <FileText size={32} className="opacity-50" />
                                            </div>
                                            <p>No articles found matching your criteria.</p>
                                        </div>
                                    )}
                                </div>
                                {/* Pagination UI */}
                                {totalPages > 1 && (
                                    <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Page {page} of {totalPages}</span>
                                        <div className="flex space-x-2">
                                            <button
                                                disabled={page === 1}
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-50 hover:bg-gray-100 transition-all shadow-sm"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                disabled={page === totalPages}
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-50 hover:bg-gray-100 transition-all shadow-sm"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- Videos Tab --- */}
                    {
                        activeTab === 'videos' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-bold mb-8 flex items-center text-gray-800">
                                        <span className="w-1.5 h-6 bg-red-500 rounded-full mr-3"></span>
                                        Add Video Content
                                    </h2>
                                    <form onSubmit={handleVideoSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Video Title</label>
                                                <input type="text" placeholder="Enter video title..." value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all" required />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">YouTube URL</label>
                                                <input type="url" placeholder="https://youtube.com/watch?v=..." value={videoForm.url} onChange={e => setVideoForm({ ...videoForm, url: e.target.value })} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all" required />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Description</label>
                                            <textarea placeholder="Video Description (Optional)" value={videoForm.description} onChange={e => setVideoForm({ ...videoForm, description: e.target.value })} className="border border-gray-200 p-3 rounded-xl w-full h-32 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all resize-none" />
                                        </div>
                                        <div className="flex justify-end pt-2">
                                            <button type="submit" className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all transform active:scale-95 flex items-center">
                                                <VideoIcon size={18} className="mr-2" />
                                                Add to Playlist
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                        <h2 className="font-bold text-lg text-gray-800">Video Library</h2>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {videos.map(v => {
                                            const getYouTubeId = (url: string) => {
                                                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                                const match = url.match(regExp);
                                                return (match && match[2].length === 11) ? match[2] : null;
                                            };
                                            const videoId = getYouTubeId(v.url);
                                            return (
                                                <div key={v._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                                                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                                        <img src={videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : 'https://via.placeholder.com/320x180?text=No+Thumbnail'} alt="Thumbnail" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                                            <button onClick={() => handleDeleteVideo(v._id)} className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-red-700 transform scale-90 group-hover:scale-100 transition-all flex items-center shadow-lg">
                                                                <LogOut size={16} className="mr-2" />
                                                                Remove
                                                            </button>
                                                        </div>
                                                        <a href={v.url} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-100 group-hover:opacity-0 transition-opacity">
                                                            Watch
                                                        </a>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{v.title}</h3>
                                                        <p className="text-xs text-gray-500 line-clamp-2">{v.description || 'No description provided.'}</p>
                                                        <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                                                            <span>YouTube Video</span>
                                                            <span>{v.views || 0} views</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {videos.length === 0 && (
                                            <div className="col-span-full py-16 text-center text-gray-400 flex flex-col items-center">
                                                <VideoIcon size={48} className="mb-4 opacity-20" />
                                                <p>No videos added to the library yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* --- Categories Tab --- */}
                    {
                        activeTab === 'categories' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                                            <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
                                            Add Category
                                        </h2>
                                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Category Name</label>
                                                <input type="text" placeholder="e.g. Technology" value={categoryForm.name} onChange={e => setCategoryForm({ name: e.target.value })} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" required />
                                            </div>
                                            <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-xl transition-all flex items-center justify-center">
                                                <Layers size={18} className="mr-2" />
                                                Create Category
                                            </button>
                                        </form>
                                    </div>

                                    <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                            <h2 className="font-bold text-lg text-gray-800">Active Categories</h2>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex flex-wrap gap-3">
                                                {categories.map(c => (
                                                    <div key={c._id} className="group bg-white text-gray-700 pl-4 pr-1 py-1.5 rounded-full flex items-center shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                                                        <span className="font-medium mr-2">{c.name}</span>
                                                        <button onClick={() => handleDeleteCategory(c._id)} className="w-7 h-7 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {categories.length === 0 && <span className="text-gray-400 italic py-4 block w-full text-center">No categories defined. Add one to get started.</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* --- Pages Tab --- */}
                    {
                        activeTab === 'pages' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-bold mb-8 flex items-center text-gray-800">
                                        <span className="w-1.5 h-6 bg-teal-500 rounded-full mr-3"></span>
                                        {editingPageId ? 'Edit Page' : 'Create New Page'}
                                    </h2>
                                    <form onSubmit={handlePageSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Page Title</label>
                                                <input type="text" value={pageForm.title} onChange={e => setPageForm({ ...pageForm, title: e.target.value })} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all" required placeholder="e.g. About Us" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Slug (URL Path)</label>
                                                <div className="flex items-center">
                                                    <span className="bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl px-3 py-3 text-gray-500 text-sm">/</span>
                                                    <input type="text" value={pageForm.slug} onChange={e => setPageForm({ ...pageForm, slug: e.target.value })} className="border border-gray-200 p-3 rounded-r-xl w-full focus:ring-2 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all" required placeholder="about-us" />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Meta Description (SEO)</label>
                                                <input type="text" value={pageForm.metaDescription} onChange={e => setPageForm({ ...pageForm, metaDescription: e.target.value })} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all" placeholder="Brief description for search engines..." />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Page Content</label>
                                            <div className="h-80 mb-12 bg-white rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-teal-100 focus-within:border-teal-500 transition-all">
                                                <ReactQuill theme="snow" value={pageForm.content} onChange={(c) => setPageForm({ ...pageForm, content: c })} className="h-full border-none" modules={{ toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'image']] }} />
                                            </div>
                                        </div>
                                        <div className="pt-6 flex justify-end">
                                            <button type="submit" className="bg-teal-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:shadow-xl transform active:scale-95 transition-all flex items-center">
                                                <FileText size={18} className="mr-2" />
                                                {editingPageId ? 'Update Page' : 'Publish Page'}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                        <h2 className="font-bold text-lg text-gray-800">Custom Pages Library</h2>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {pages.map(p => (
                                            <div key={p._id} className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-gray-50 transition-colors group">
                                                <div className="flex items-start space-x-4 mb-4 md:mb-0">
                                                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <FileText size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg">{p.title}</h3>
                                                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                                            <code className="bg-gray-100 px-2 py-0.5 rounded text-blue-600 font-mono">/{p.slug}</code>
                                                            <span>•</span>
                                                            <span>Updated: {new Date(p.updatedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3 opacity-80 md:opacity-0 group-hover:opacity-100 transition-all">
                                                    <Link to={`/${p.slug}`} target="_blank" className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm">
                                                        View Live
                                                    </Link>
                                                    <button onClick={() => handleEditPage(p)} className="px-4 py-2 bg-teal-50 text-teal-600 rounded-lg text-sm font-bold hover:bg-teal-100 transition-colors">
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDeletePage(p._id)} className="px-4 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {pages.length === 0 && (
                                            <div className="p-16 text-center text-gray-400 flex flex-col items-center">
                                                <Layers size={48} className="mb-4 opacity-20" />
                                                <p className="italic">No custom pages created yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* --- Settings Tab --- */}
                    {
                        activeTab === 'settings' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl">
                                    <h2 className="text-xl font-bold mb-8 flex items-center text-gray-800">
                                        <span className="w-1.5 h-6 bg-gray-900 rounded-full mr-3"></span>
                                        Platform Configuration
                                    </h2>
                                    <form onSubmit={handleSettingsSubmit} className="space-y-8">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Channel Name</label>
                                                <input type="text" value={settings.channelName} onChange={e => setSettings({ ...settings, channelName: e.target.value })} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-gray-200 focus:border-gray-900 outline-none transition-all" required />
                                                <p className="text-[10px] text-gray-400 ml-1">Visible on homepage branding area.</p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Channel URL</label>
                                                <input type="url" value={settings.channelUrl} onChange={e => setSettings({ ...settings, channelUrl: e.target.value })} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-gray-200 focus:border-gray-900 outline-none transition-all" required />
                                                <p className="text-[10px] text-gray-400 ml-1">Destination for subscribe buttons.</p>
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Subscribers Count Text</label>
                                                <input type="text" value={settings.channelSubscribers} onChange={e => setSettings({ ...settings, channelSubscribers: e.target.value })} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-gray-200 focus:border-gray-900 outline-none transition-all" required />
                                                <p className="text-[10px] text-gray-400 ml-1">Displayed as social proof (e.g. "1.2M Subscribers").</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">Advertising Banner</h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Banner Image URL</label>
                                                    <input type="text" value={settings.adBannerImage || ''} onChange={e => setSettings({ ...settings, adBannerImage: e.target.value })} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-gray-200 focus:border-gray-900 outline-none transition-all" placeholder="https://..." />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Destination URL</label>
                                                    <input type="url" value={settings.adBannerUrl || ''} onChange={e => setSettings({ ...settings, adBannerUrl: e.target.value })} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-gray-200 focus:border-gray-900 outline-none transition-all" placeholder="https://..." />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-gray-200 hover:bg-black hover:shadow-xl transform active:scale-95 transition-all flex items-center">
                                                <SettingsIcon size={18} className="mr-2" />
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )
                    }

                    {/* --- Admins Tab --- */}
                    {
                        activeTab === 'admins' && role === 'superadmin' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                                        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                                            <span className="w-1.5 h-6 bg-purple-600 rounded-full mr-3"></span>
                                            Add New Admin
                                        </h2>
                                        <form onSubmit={handleAdminSubmit} className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Username</label>
                                                <input type="text" name="username" value={adminForm.username} onChange={e => setAdminForm({ ...adminForm, username: e.target.value })} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all" placeholder="e.g. johndoe" required />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Password</label>
                                                <input type="password" name="password" value={adminForm.password} onChange={e => setAdminForm({ ...adminForm, password: e.target.value })} className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all" placeholder="••••••••" required />
                                            </div>
                                            <button className="w-full bg-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 hover:shadow-xl transition-all flex items-center justify-center mt-4">
                                                <Users size={18} className="mr-2" />
                                                Grant Access
                                            </button>
                                        </form>
                                    </div>

                                    <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                            <h2 className="font-bold text-lg text-gray-800">Administrative Team</h2>
                                        </div>
                                        <div className="divide-y divide-gray-50">
                                            {admins.map(a => (
                                                <div key={a._id} className="flex justify-between items-center p-6 hover:bg-gray-50 transition-colors group">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-50 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm border border-purple-100">
                                                            {a.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900">{a.username}</h3>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-500 mt-1">
                                                                {a.role}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {a.role !== 'superadmin' && (
                                                        <button onClick={() => handleDeleteAdmin(a._id)} className="bg-white border border-gray-200 text-red-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                                                            Revoke Access
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </main >
            </div >
        </div >
    );
};

export default AdminDashboard;
