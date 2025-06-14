
import { Link, Outlet, useLocation } from 'react-router-dom';
// import { Button } from "../../../components/ForumComponents/ui/button";

import { Heart } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  return (
    <div className="min-h-screen flex flex-col">
      <nav className=" flex justify-between  supports-[backdrop-filter]:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-teal-600" />
              <Link to="/" className="text-xl font-bold text-white">HealthCare+</Link>
            </div>

          </div>
        </div>
        {/* User Info */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-semibold">
            JD
          </div>
          <div className="min-w-20">
            <div className="text-sm text-white font-medium truncate whitespace-nowrap overflow-hidden max-w-[160px]">
              John Do. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt ad dolore pariatur blanditiis, at quidem velit consequatur quaerat ullam earum, cum excepturi laborum? Voluptatum laboriosam, eaque facere eveniet corrupti quibusdam.
            </div>
            <div className="text-xs text-white truncate whitespace-nowrap overflow-hidden max-w-[160px]">
              Counselor
            </div>
          </div>


        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-teal-400" />
                <span className="text-lg font-bold">HealthCare+</span>
              </div>
              <p className="text-gray-400">Comprehensive sexual health care services for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/services/consultation">Consultations</Link></li>
                <li><Link to="/services/testing">STI Testing</Link></li>
                <li><Link to="/services/cycle-tracking">Cycle Tracking</Link></li>
                <li><Link to="/services/education">Education</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/support">Support</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 (555) 123-4567</li>
                <li>📧 info@healthcare-plus.com</li>
                <li>📍 123 Health St, Medical City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HealthCare+. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
