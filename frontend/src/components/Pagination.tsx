import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = () => {
    return (
        <div className="flex justify-center items-center space-x-3 mt-16 pb-8">
            <nav className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-brand-600 hover:bg-white transition-all disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-600/20 transform scale-105">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-brand-600 hover:bg-white font-bold text-xs transition-all">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-brand-600 hover:bg-white font-bold text-xs transition-all">3</button>
                    <span className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold text-xs pb-2 select-none">...</span>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-brand-600 hover:bg-white font-bold text-xs transition-all">10</button>
                </div>

                <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-brand-600 hover:bg-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
