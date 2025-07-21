import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Heart, LogOut } from "lucide-react";
import Sidebar from './pages/Sidebar'; // Đảm bảo import đúng đường dẫn
import { UserAuth } from "../../hooks/Context/AuthContext.jsx";
import React, { useState, useEffect } from 'react';

const Layout = () => {
  const location = useLocation();
  const { logout } = UserAuth();
  const isCounselorRoute = location.pathname.startsWith('/counselor');
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const UserId = localStorage.getItem('UserId');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("❌ Token is missing");
          return;
        }

        const response = await fetch(`${API_URL}/accounts/${UserId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          console.error("Failed to fetch user data with status:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };


    if (UserId) {
      fetchUserInfo();
    }
  }, [UserId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('UserId');
    localStorage.removeItem('UserRole');
    localStorage.setItem('IsLogIn', 'false');
    logout();
    // navigate('/login');
  };

  return (
    <div>
      <div className="h-screen flex flex-col">
        {/* Navbar */}
        <nav className=" bg-gray-900 text-white">
          <div className=" mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-teal-600" />
              <Link to="/" className="text-xl font-bold text-white">HealthCare+</Link>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-semibold">
                {userInfo?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-20">
                <div className="text-sm font-medium truncate max-w-[160px]">{userInfo?.name || 'User'}</div>
                <div className="text-xs text-gray-300 truncate">Counselor</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-red-400 hover:text-red-600 transition"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Đăng xuất
              </button>
            </div>
          </div>
        </nav>

        {/* Content area: Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 bg-white border-r flex-shrink-0">
            <Sidebar />
          </aside>

          <main className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50 p-6">
            <Outlet />
          </main>
        </div>

        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
      </div>

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
