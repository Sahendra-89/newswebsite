import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import DynamicPage from './pages/DynamicPage';
import CurrentPages from './pages/CurrentPages';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AboutPage from './pages/AboutPage';
import { useEffect } from 'react';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language === 'hi') {
      document.body.classList.add('lang-hi');
    } else {
      document.body.classList.remove('lang-hi');
    }
  }, [i18n.language]);

  return (
    <Router>
      <Routes>
        {/* Public Routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/category/*" element={<CategoryPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/current-news" element={<CurrentPages />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/page/:slug" element={<DynamicPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/video/:id" element={<VideoPlayerPage />} />
        </Route>

        {/* Admin Routes - No MainLayout (or different layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
