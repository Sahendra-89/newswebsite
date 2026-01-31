import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Eye, FileText, Mail } from 'lucide-react';

const PrivacyPolicyPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
                <title>Privacy Policy | ShotNsense News</title>
                <meta name="description" content="Privacy Policy for ShotNsense News. Learn how we collect, use, and protect your information." />
            </Helmet>

            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 shadow-sm">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        We value your trust and are committed to protecting your personal information. This policy outlines our practices.
                    </p>
                    <p className="text-sm font-bold text-gray-400 mt-4 uppercase tracking-widest">Last Updated: January 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12 space-y-12">

                        {/* Section 1 */}
                        <section>
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">1</div>
                                <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
                            </div>
                            <div className="prose prose-lg text-gray-600 pl-14">
                                <p>
                                    Welcome to ShotNsense News. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                                </p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">2</div>
                                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                            </div>
                            <div className="pl-14 space-y-6">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="flex items-center font-bold text-gray-900 mb-2">
                                        <FileText className="w-5 h-5 mr-2 text-blue-500" />
                                        Personal Data
                                    </h3>
                                    <p className="text-gray-600">
                                        Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as newsletter subscriptions.
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="flex items-center font-bold text-gray-900 mb-2">
                                        <Eye className="w-5 h-5 mr-2 text-blue-500" />
                                        Derivative Data
                                    </h3>
                                    <p className="text-gray-600">
                                        Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">3</div>
                                <h2 className="text-2xl font-bold text-gray-900">Use of Your Information</h2>
                            </div>
                            <div className="prose prose-lg text-gray-600 pl-14">
                                <p className="mb-4">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                                <ul className="space-y-2 list-disc pl-5">
                                    <li>Create and manage your account.</li>
                                    <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
                                    <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
                                    <li>Email you regarding your account or order.</li>
                                    <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">4</div>
                                <h2 className="text-2xl font-bold text-gray-900">Cookies and Web Beacons</h2>
                            </div>
                            <div className="prose prose-lg text-gray-600 pl-14">

                                <p>
                                    We use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site, improve your experience, and provide personalized advertisements. When you access the Site, your personal information is not collected through the use of tracking technology.
                                </p>

                                <h3 className="font-bold text-gray-900 mt-6 mb-3">What are Cookies?</h3>
                                <p>
                                    A cookie is a small piece of data usually stored on your computer by a website you visit. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                                </p>

                                <h3 className="font-bold text-gray-900 mt-6 mb-3">Types of Cookies We Use</h3>
                                <ul className="space-y-4 list-none pl-0">
                                    <li className="bg-blue-50/50 p-4 rounded-xl">
                                        <strong className="text-gray-900 block mb-1">Essential Cookies</strong>
                                        <span className="text-sm">Necessary for the functioning of the website. These cookies enable core functionality such as security, network management, and accessibility.</span>
                                    </li>
                                    <li className="bg-blue-50/50 p-4 rounded-xl">
                                        <strong className="text-gray-900 block mb-1">Analytics Cookies</strong>
                                        <span className="text-sm">We use these to collect information about how visitors use our website. This helps us improve the way our website works, for example, by ensuring that users are finding what they are looking for easily.</span>
                                    </li>
                                    <li className="bg-blue-50/50 p-4 rounded-xl">
                                        <strong className="text-gray-900 block mb-1">Advertising Cookies</strong>
                                        <span className="text-sm">These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user. Our advertising partners (such as Google AdSense) may set these cookies to build a profile of your interests and show you relevant ads on other sites.</span>
                                    </li>
                                </ul>

                                <h3 className="font-bold text-gray-900 mt-6 mb-3">Third-Party Cookies (Google AdSense)</h3>
                                <p>
                                    We use Google AdSense to display ads. Google uses cookies to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.
                                </p>

                                <h3 className="font-bold text-gray-900 mt-6 mb-3">Your Choices</h3>
                                <p>
                                    You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites. You may also opt-out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-blue-600 underline">Google Ads Settings</a>.
                                </p>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section>
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">5</div>
                                <h2 className="text-2xl font-bold text-gray-900">Third-Party Websites</h2>
                            </div>
                            <div className="prose prose-lg text-gray-600 pl-14">
                                <p>
                                    The Site may contain links to third-party websites and applications of interest, including advertisements and external services (e.g. Google AdSense, YouTube). Once you have used these links to leave the Site, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information.
                                </p>
                            </div>
                        </section>



                        {/* Section 6 */}
                        <section>
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">6</div>
                                <h2 className="text-2xl font-bold text-gray-900">Shorts Content Privacy Policy</h2>
                            </div>
                            <div className="prose prose-lg text-gray-600 pl-14">
                                <p>
                                    Our platform features short-form video content, including "YouTube Shorts" and other embedded video materials. By accessing and viewing this content, you acknowledge and agree to the following privacy terms:
                                </p>
                                <ul className="space-y-2 list-disc pl-5 mt-4">
                                    <li><strong>YouTube API Services:</strong> We utilize YouTube API Services to deliver Shorts and video content. By watching these videos, you are agreeing to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">YouTube Terms of Service</a>.</li>
                                    <li><strong>Google Privacy Policy:</strong> Any data collected by YouTube through the embedded player is subject to the <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google Privacy Policy</a>. We encourage you to review this policy to understand how your viewing data is managed by Google.</li>
                                    <li><strong>User Interaction:</strong> Interactions with Shorts (such as likes, views, or shares) may be tracked by the video platform provider. We do not store your personal viewing history on our servers.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 7 */}
                        <section>
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">7</div>
                                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-gray-600 mb-6">
                                    If you have questions or comments about this Privacy Policy, please contact us at:
                                </p>
                                <div className="bg-gray-900 text-white p-6 rounded-2xl inline-block pr-12">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <span className="font-bold">contact@shotnsense.com</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Shield className="w-5 h-5 text-gray-400" />
                                        <span className="font-bold">ShotNsense News Media</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
