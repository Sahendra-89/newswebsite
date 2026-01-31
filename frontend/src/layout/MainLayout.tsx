import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col antialiased text-slate-900 bg-gray-50">
            <Navbar />
            <main className="flex-grow pt-24 md:pt-28">
                {children || <Outlet />}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
