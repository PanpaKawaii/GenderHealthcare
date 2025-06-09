import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { accountAPI } from '../../../../services/api'; 

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await accountAPI.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // If token is invalid, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Forum', path: '/forum' },
    { name: 'Menstrual Tracker', path: '/menstrual-tracker' },
    { name: 'Reminders', path: '/reminders' },
    { name: 'Blogs', path: '/blog' },

  ];
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold">GenderHealthcare</Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navItems.map(item => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`hover:text-indigo-200 ${
                    location.pathname === item.path ? 'font-bold text-white border-b-2 border-white' : 'text-indigo-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* User Menu (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative group">
                <button className="flex items-center space-x-1 focus:outline-none">
                  <span>{user?.name || 'User'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 w-40 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-indigo-100">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-indigo-500">
              <div className="flex flex-col space-y-3">
                {navItems.map(item => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`py-2 ${location.pathname === item.path ? 'font-bold' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link 
                  to="/profile" 
                  className="py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left py-2"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-6 px-4">
          <Outlet />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">GenderHealthcare</h3>
              <p className="text-gray-400">Promoting and supporting reproductive health education and wellness.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul className="space-y-2">
                <li><Link to="/forum" className="text-gray-400 hover:text-white">Forum</Link></li>
                <li><Link to="/menstrual-tracker" className="text-gray-400 hover:text-white">Menstrual Tracker</Link></li>
                <li><Link to="/reminders" className="text-gray-400 hover:text-white">Reminders</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">Email: contact@genderhealthcare.com</p>
              <p className="text-gray-400">Phone: +123 456 7890</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} GenderHealthcare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;