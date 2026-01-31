import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu, X, Search, Globe, ChevronRight,
  Info, Newspaper, Trophy, Flag,
  Cpu, Briefcase, GraduationCap, Palette, Zap, Gavel,
  Tv, FlaskConical, MapPin
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getCategories } from "../services/api";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        const data = res.data || [];
        // Dedup categories by name
        const uniqueCats = data.filter((cat: any, index: number, self: any[]) =>
          index === self.findIndex((t: any) => t.name === cat.name)
        );
        // Remove 'Cricket' and 'Sports' (case-insensitive) - 'Current News' is now allowed
        const excluded = ['cricket', 'sports'];
        const filteredCats = uniqueCats.filter((cat: any) =>
          !excluded.includes(cat.name.toLowerCase())
        );
        setDbCategories(filteredCats);
      } catch (err) {
        console.error("Failed to fetch categories for navbar", err);
      }
    };
    fetchCats();
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Dynamic Category Icon Mapping
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('politics') || lower.includes('government')) return <Gavel className="w-5 h-5 text-red-500" />;
    if (lower.includes('business') || lower.includes('economy')) return <Briefcase className="w-5 h-5 text-amber-500" />;
    if (lower.includes('technology') || lower.includes('tech')) return <Cpu className="w-5 h-5 text-cyan-500" />;
    if (lower.includes('cricket')) return <Trophy className="w-5 h-5 text-blue-500" />;
    if (lower.includes('sports')) return <Zap className="w-5 h-5 text-orange-500" />;
    if (lower.includes('entertainment') || lower.includes('tv')) return <Tv className="w-5 h-5 text-pink-500" />;
    if (lower.includes('health') || lower.includes('science')) return <FlaskConical className="w-5 h-5 text-emerald-500" />;
    if (lower.includes('education') || lower.includes('job')) return <GraduationCap className="w-5 h-5 text-indigo-500" />;
    if (lower.includes('regional') || lower.includes('local')) return <MapPin className="w-5 h-5 text-rose-500" />;
    if (lower.includes('current')) return <Newspaper className="w-5 h-5 text-green-500" />;
    if (lower.includes('international')) return <Globe className="w-5 h-5 text-purple-500" />;
    if (lower.includes('design')) return <Palette className="w-5 h-5 text-pink-500" />;
    return <Flag className="w-5 h-5 text-gray-400" />;
  };

  const sidebarLinks = dbCategories.map((cat) => ({
    name: cat.name,
    path: `/category/${encodeURIComponent(cat.name)}`,
    icon: getCategoryIcon(cat.name)
  }));

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-black transition-all duration-300 shadow-2xl">
        {/* Upper Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/5">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 md:space-x-6">
              <button
                onClick={toggleSidebar}
                className="flex items-center space-x-2 p-2 text-white hover:bg-white/10 rounded-lg transition-all group"
                aria-label="Open sidebar"
              >
                <Menu className="w-6 h-6" />
                <span className="hidden lg:block text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Menu</span>
              </button>

              <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                <img src="/logo.png" alt="ShotNsense Logo" className="h-14 md:h-16 w-auto object-contain" />
                <span className="text-xl font-display font-black text-white tracking-tighter uppercase ml-2 hidden md:block">
                  ShotNsense<span className="text-brand-500">News</span>
                </span>
              </Link>
            </div>

            {/* Search & Auth */}
            <div className="flex items-center space-x-2 md:space-x-6 ml-auto">
              {/* Language Switcher */}
              <button
                onClick={() => i18n.changeLanguage(i18n.language?.startsWith('en') ? 'hi' : 'en')}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center gap-1 group"
                title="Change Language"
              >
                <Globe className="w-4 h-4 group-hover:text-brand-500 transition-colors" />
                <span className="text-xs font-bold">{i18n.language?.startsWith('en') ? 'हिंदी' : 'English'}</span>
              </button>

              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-1.5 border border-white/10 focus-within:border-brand-500 focus-within:bg-white/10 transition-all">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('navbar.search_placeholder')}
                  className="bg-transparent border-none text-white text-xs font-bold focus:ring-0 w-24 lg:w-48 transition-all placeholder:text-gray-600 ml-2"
                />
              </form>

              {/* Mobile Search Icon */}
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
                <Search className="w-5 h-5" />
              </button>

              {user ? (
                <div className="flex items-center space-x-2 md:space-x-4">
                  <div className="hidden lg:flex flex-col items-end">
                    <span className="text-[9px] text-brand-500 uppercase font-black tracking-widest">{t('navbar.premium')}</span>
                    <span className="text-white font-bold text-xs tracking-tight">{user.username}</span>
                  </div>
                  <button onClick={logout} className="bg-white/5 hover:bg-red-600 text-gray-300 hover:text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-black transition-all group border border-white/10 hover:border-red-600">
                    {t('navbar.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 md:space-x-4">
                  <Link to="/login" className="hidden xs:block text-[10px] md:text-xs font-black text-gray-400 hover:text-white transition-all uppercase tracking-widest">{t('navbar.login')}</Link>
                  <Link to="/register" className="bg-brand-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-black shadow-xl shadow-brand-600/20 hover:bg-brand-700 hover:-translate-y-0.5 transition-all uppercase tracking-widest">{t('navbar.register')}</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="md:hidden bg-zinc-900 p-4 border-b border-white/5 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSearch} className="flex items-center bg-white/5 rounded-xl px-4 py-3 border border-white/10">
              <Search className="w-5 h-5 text-gray-500 mr-3" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics..."
                className="bg-transparent border-none text-white text-sm focus:ring-0 w-full"
              />
              <button type="button" onClick={() => setIsSearchOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </form>
          </div>
        )}

        {/* Sub-Navbar */}
        <div className="bg-zinc-900 border-b border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-6 md:space-x-8 h-10 md:h-12 overflow-x-auto no-scrollbar scroll-smooth">
              <NavLink to="/" end className={({ isActive }) => `text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all h-full flex items-center border-b-2 whitespace-nowrap ${isActive ? "text-brand-500 border-brand-500" : "text-white border-transparent hover:text-gray-300"}`}>{t('navbar.latest')}</NavLink>
              <NavLink to="/about" onClick={() => { setTimeout(() => { const el = document.getElementById('services'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); }} className={() => `text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all h-full flex items-center border-b-2 whitespace-nowrap ${location.hash === '#services' ? "text-brand-500 border-brand-500" : "text-white border-transparent hover:text-gray-300"}`}>{t('navbar.services')}</NavLink>
              {dbCategories.map(cat => (
                <NavLink
                  key={cat._id}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  className={({ isActive }) => `text-[10px] md:text-xs font-black uppercase tracking-widest transition-all h-full flex items-center border-b-2 whitespace-nowrap ${isActive ? "text-brand-500 border-brand-500" : "text-white border-transparent hover:text-gray-300"}`}
                >
                  {cat.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[60] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-72 md:w-80 bg-black z-[70] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-white/5 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 md:p-8 flex items-center justify-between">
          <Link to="/" onClick={toggleSidebar} className="flex items-center space-x-3">
            <img src="/logo.png" alt="ShotNsense" className="h-12 w-auto object-contain" />
            <span className="text-lg font-black text-white uppercase tracking-tighter">ShotNsense News</span>
          </Link>
          <button onClick={toggleSidebar} className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto py-4 px-4 md:px-6 no-scrollbar">
          <div className="mb-10">
            <h3 className="px-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">{t('navbar.world_categories')}</h3>
            <div className="space-y-1 md:space-y-2">
              {sidebarLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={toggleSidebar}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 md:px-5 md:py-4 rounded-2xl transition-all group ${isActive
                      ? "bg-brand-600 text-white shadow-xl shadow-brand-600/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-xl transition-colors ${location.pathname === link.path ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                      {link.icon}
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{link.name}</span>
                  </div>
                  <ChevronRight className={`w-3 h-3 transition-all ${location.pathname === link.path ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transform translate-x-1'}`} />
                </NavLink>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 mt-4">
            <h3 className="px-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">{t('navbar.direct_access')}</h3>
            <div className="space-y-1">
              <a href="/#videos" onClick={toggleSidebar} className="flex items-center space-x-4 px-5 py-3 text-gray-400 hover:text-white transition-all group">
                <Zap className="w-4 h-4 text-yellow-500 group-hover:scale-125 transition-transform" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{t('navbar.viral_videos')}</span>
              </a>
              <Link to="/about" onClick={toggleSidebar} className="flex items-center space-x-4 px-5 py-3 text-gray-400 hover:text-white transition-all group">
                <Info className="w-4 h-4 text-brand-500 group-hover:scale-125 transition-transform" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{t('navbar.company_profile')}</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-t border-white/5 bg-zinc-950">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-brand-600/20">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <div className="text-white text-xs md:text-sm font-black uppercase tracking-widest truncate w-20 md:w-24">{user.username}</div>
                  <div className="text-brand-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">{t('navbar.verified')}</div>
                </div>
              </div>
              <button onClick={logout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all" title="Logout">
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 md:space-y-3">
              <Link to="/register" onClick={toggleSidebar} className="text-center py-3 md:py-4 rounded-2xl text-[10px] md:text-xs font-black bg-brand-600 text-white hover:bg-brand-700 shadow-xl shadow-brand-600/20 transition-all uppercase tracking-widest">{t('navbar.apply_now')}</Link>
              <Link to="/login" onClick={toggleSidebar} className="text-center py-3 md:py-4 rounded-2xl text-[10px] md:text-xs font-black text-gray-400 border border-white/10 hover:bg-white/5 transition-all uppercase tracking-widest">{t('navbar.sign_in')}</Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
