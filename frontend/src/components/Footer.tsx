import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Linkedin, Youtube, Mail, ChevronRight } from "lucide-react";
import { getCategories } from "../services/api";

const Footer = () => {
  const [categories, setCategories] = useState<any[]>([]); // Using any[] or Category[] if available

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        const data = res.data || [];
        // Dedup and take top 6 for footer
        const uniqueCats = data.filter((cat: any, index: number, self: any[]) =>
          index === self.findIndex((t: any) => t.name === cat.name)
        ).slice(0, 6);
        setCategories(uniqueCats);
      } catch (err) {
        console.error("Footer category fetch failed", err);
      }
    };
    fetchCats();
  }, []);

  return (
    <footer className="bg-[#0e0e0e] text-gray-400 font-sans border-t border-white/10">
      {/* Top Bar with Logo & Socials */}
      <div className="border-b border-white/5 bg-[#161616]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="ShotNsense" className="h-12 w-auto object-contain" />
            <span className="text-lg font-black text-white tracking-tighter uppercase">ShotNsense<span className="text-brand-600">News</span></span>
          </div>

          <div className="flex items-center space-x-1">
            {[
              { Icon: Twitter, color: "hover:text-[#1DA1F2]", href: "https://x.com/ranjanyadavs?s=21" },
              { Icon: Facebook, color: "hover:text-[#1877F2]", href: "https://www.facebook.com/share/171fexhcdG/?mibextid=wwXIfr" },
              { Icon: Instagram, color: "hover:text-[#E4405F]", href: "https://www.facebook.com/share/171fexhcdG/?mibextid=wwXIfr" },
              { Icon: Youtube, color: "hover:text-[#FF0000]", href: "https://www.instagram.com/wordsbyranjanyadav?igsh=MTE4a293emNlMml6bA==" },
              { Icon: Linkedin, color: "hover:text-[#0A66C2]", href: "https://www.linkedin.com/in/ranjan-yadav-955063395?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" }
            ].map(({ Icon, color, href }, idx) => (
              <a key={idx} href={href} target="_blank" rel="noopener noreferrer" className={`p-2 hover:bg-white/10 rounded-full transition-all text-gray-400 ${color} group`}>
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-8">

          {/* Column 1: Explore */}
          <div className="col-span-1">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Explore</h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    to={`/category/${encodeURIComponent(cat.name)}`}
                    className="flex items-center text-sm font-medium hover:text-brand-500 transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all -ml-5 group-hover:ml-0 text-brand-500" />
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/current-news" className="flex items-center text-sm font-medium hover:text-brand-500 transition-colors group">
                  <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all -ml-5 group-hover:ml-0 text-brand-500" />
                  Current News
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Overview */}
          <div className="col-span-1">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Overview</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Press', 'Contact', 'Advertise'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'About Us' ? '/about' : '#'}
                    className="block text-sm font-medium hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Community */}
          <div className="col-span-1">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Community</h3>
            <ul className="space-y-3">
              {['Community Central', 'Support', 'Help', 'Do Not Sell My Info'].map((item) => (
                <li key={item}>
                  <a href="#" className="block text-sm font-medium hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="col-span-1">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Legal</h3>
            <ul className="space-y-3">
              {['Terms of Use', 'Privacy Policy', 'Cookie Policy', 'Global Sitemap', 'Local Sitemap'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Privacy Policy' ? '/privacy' : '#'} className="block text-sm font-medium hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 border-t md:border-t-0 border-white/10 pt-8 md:pt-0">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Newsletter</h3>
            <p className="text-xs leading-relaxed mb-4">
              Get the best of ShotNsense delivered to your inbox daily. No spam, ever.
            </p>
            <form className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-brand-600 focus:bg-black transition-all"
                />
              </div>
              <button className="w-full bg-brand-700 hover:bg-brand-600 text-white text-xs font-black uppercase tracking-widest py-2.5 rounded-sm transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <div className="uppercase tracking-widest font-bold">
            ShotNsense News Media
          </div>
          <div className="flex space-x-6">
            <span>&copy; {new Date().getFullYear()} ShotNsense Inc.</span>
            <span className="hidden md:inline">|</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
