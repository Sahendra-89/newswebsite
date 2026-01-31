
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Laptop, ShoppingCart, Wrench, Search, Palette, Shield, ArrowRight } from 'lucide-react';
import ServiceRequestModal from '../components/ServiceRequestModal';

const AboutPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState('Website Development');

    const handleOpenModal = (serviceName: string) => {
        setSelectedService(serviceName);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
                <title>Services - Web Development & Design | ShotNsense News</title>
                <meta name="description" content="Explore our professional website development services including design, e-commerce, SEO, and maintenance." />
            </Helmet>


            <ServiceRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                preselectedService={selectedService}
            />

            {/* What We Provide / Why Choose Us Section */}
            <section className="bg-white py-16 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-600 font-bold tracking-widest uppercase text-sm">Our Promise</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4">What We Provide</h2>
                        <p className="max-w-2xl mx-auto text-lg text-gray-600">
                            We are dedicated to delivering truth and empowering our community through information and innovation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6 mx-auto">
                                <Shield size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Unbiased Journalism</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                We believe in the power of truth. Our reporting is factual, independent, and free from corporate or political influence.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
                                <Search size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">In-Depth Analysis</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                We go beyond the headlines. Our team provides deep-dive analysis and investigative stories that matter to you.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 mx-auto">
                                <Laptop size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Digital Innovation</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Merging media with technology, we provide cutting-edge digital services to help businesses thrive in the modern era.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Website Development Services</h2>
                        <p className="max-w-2xl mx-auto text-lg text-gray-600">
                            Beyond news, we offer professional digital solutions to help your business grow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Service 1: Website Design & Development */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                <Laptop size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Website Design & Development</h3>
                            <p className="text-gray-600 mb-4 flex-grow">
                                We build custom, responsive, and fast websites tailored to your specific needs.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 mb-6">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Custom Design</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Mobile Responsive</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>High Performance</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Secure Architecture</li>
                            </ul>
                            <button
                                onClick={() => handleOpenModal('Website Development')}
                                className="w-full mt-auto bg-brand-600 text-white hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group"
                            >
                                Request Service <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Service 2: E-Commerce Development */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                                <ShoppingCart size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">E-Commerce Development</h3>
                            <p className="text-gray-600 mb-4 flex-grow">
                                Launch your online store with our robust e-commerce solutions.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 mb-6">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Online Store Setup</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Payment Gateway Integration</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Inventory Management</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>User-Friendly Checkout</li>
                            </ul>
                            <button
                                onClick={() => handleOpenModal('E-Commerce')}
                                className="w-full mt-auto bg-brand-600 text-white hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group"
                            >
                                Request Service <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Service 3: Website Maintenance & Support */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                                <Wrench size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Website Maintenance & Support</h3>
                            <p className="text-gray-600 mb-4 flex-grow">
                                Keep your website running smoothly with our ongoing support.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 mb-6">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>Regular Updates</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>Daily Backups</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>Bug Fixes</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>Priority Support</li>
                            </ul>
                            <button
                                onClick={() => handleOpenModal('Maintenance')}
                                className="w-full mt-auto bg-brand-600 text-white hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group"
                            >
                                Request Service <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Service 4: SEO & Performance Optimization */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                                <Search size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">SEO & Performance Optimization</h3>
                            <p className="text-gray-600 mb-4 flex-grow">
                                Improve your visibility and speed to reach more customers.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 mb-6">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>Search-Friendly Structure</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>Page Speed Optimization</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>On-Page SEO</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>Analytics Integration</li>
                            </ul>
                            <button
                                onClick={() => handleOpenModal('SEO')}
                                className="w-full mt-auto bg-brand-600 text-white hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group"
                            >
                                Request Service <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Service 5: Website Redesign & Upgrades */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-6">
                                <Palette size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Website Redesign & Upgrades</h3>
                            <p className="text-gray-600 mb-4 flex-grow">
                                Transform your existing site with a modern look and better functionality.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 mb-6">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>Modern UI/UX Design</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>Feature Enhancements</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>Mobile Optimization</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>Content Strategy</li>
                            </ul>
                            <button
                                onClick={() => handleOpenModal('Redesign')}
                                className="w-full mt-auto bg-brand-600 text-white hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group"
                            >
                                Request Service <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Service 6: Hosting & Security */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col">
                            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Hosting & Security</h3>
                            <p className="text-gray-600 mb-4 flex-grow">
                                Secure your digital assets with our reliable hosting and security services.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 mb-6">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>Domain Management</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>Reliable Hosting Setup</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>SSL Certificates</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>Malware Protection</li>
                            </ul>
                            <button
                                onClick={() => handleOpenModal('Hosting & Security')}
                                className="w-full mt-auto bg-brand-600 text-white hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group"
                            >
                                Request Service <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
