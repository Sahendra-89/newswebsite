import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

interface ServiceRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedService?: string;
}

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ isOpen, onClose, preselectedService }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        serviceType: preselectedService || 'Website Development',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        if (!formData.fullName || !formData.email || !formData.phone || !formData.message) {
            setStatus('error');
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setStatus('error');
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        // Phone Validation (Allows digits, spaces, +, -, (, ), minimum 10 digits)
        const phoneRegex = /^[\d\s+\-()]{10,}$/;
        // Simple check to ensure actual digits exist
        const digitCount = (formData.phone.match(/\d/g) || []).length;
        if (!phoneRegex.test(formData.phone) || digitCount < 10) {
            setStatus('error');
            setErrorMessage('Please enter a valid phone number (at least 10 digits).');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/services/request', formData);
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ fullName: '', email: '', phone: '', company: '', serviceType: 'Website Development', message: '' });
            }, 3000);
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.response?.data?.msg || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in slide-in-from-bottom-4 fade-in duration-300">

                {/* Header */}
                <div className="bg-brand-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white uppercase tracking-widest">Request a Quote</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                    {status === 'success' ? (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                            <p className="text-gray-600">Thank you for your interest. Our team will contact you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {status === 'error' && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Company / Organization</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Service Type *</label>
                                <select
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white"
                                    required
                                >
                                    <option value="Website Development">Website Development</option>
                                    <option value="E-Commerce">E-Commerce Development</option>
                                    <option value="SEO">SEO & Performance</option>
                                    <option value="Maintenance">Maintenance & Support</option>
                                    <option value="Redesign">Website Redesign</option>
                                    <option value="Hosting & Security">Hosting & Security</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Project Details *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-black uppercase tracking-widest py-3 rounded-xl shadow-lg shadow-brand-600/20 hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Request'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestModal;
