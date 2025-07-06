import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "../../../../components/ForumComponents/ui/button";
import { Card, CardContent } from "../../../../components/ForumComponents/ui/card";
import { Calendar, Users, MessageCircle, FileText, Heart, User, Settings, LogOut } from "lucide-react";
import { UserAuth } from '../../../../hooks/Context/AuthContext.jsx';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ForumComponents/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ForumComponents/ui/dropdown-menu";

const Layout = () => {

  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  const Role = localStorage.getItem('UserRole');
  const UserId = localStorage.getItem('UserId');
  const { logout } = UserAuth();

  useEffect(() => {
    // Fetch user info if logged in
    const fetchUserInfo = async () => {
      try {
        // Sử dụng API URL từ biến môi trường hoặc URL mặc định
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/accounts/${UserId}`);
        
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
    localStorage.removeItem('Token')
    localStorage.removeItem('UserId')
    localStorage.removeItem('UserRole')
    localStorage.removeItem('IsLogIn');
    localStorage.setItem('IsLogIn', 'false');
    logout();
    // navigate('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-teal-600" />
              <Link to="/" className="text-xl font-bold text-gray-900">HealthCare+</Link>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/forum" className="text-gray-600 hover:text-gray-900">Forum</Link>
              <Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
              <Link to="/couselortestbooking" className="text-gray-600 hover:text-gray-900">Booking</Link>
              <Link to="/parametermanager" className="text-gray-600 hover:text-gray-900">Parameter</Link>
              <Link to="/testbookingmanager" className="text-gray-600 hover:text-gray-900">TestBooking</Link>
              <Link to="/testresultmanager" className="text-gray-600 hover:text-gray-900">TestResult</Link>
              <Link to="/testresultdetailmanager" className="text-gray-600 hover:text-gray-900">TestResultDetail</Link>
              <Link to="/testserviceparametermanager" className="text-gray-600 hover:text-gray-900">TestServiceParameterManager</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
            {!Role ?
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" asChild>
                    Login
                  </Button>
                </Link>
                <Link to="/dashboardDoctor">
                  <Button asChild>
                    Dashboard
                  </Button>
                </Link>
              </div>
              :
              <div className="flex items-center gap-4">
                {Role === 'Doctor' && (
                  <div className="hidden md:flex items-center gap-2">
                    <Link to="/dashboardDoctor">
                      <Button asChild>
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                )}
                {Role === 'Admin' && (
                  <div className="hidden md:flex items-center gap-2">
                    <Link to="/admin">
                      <Button asChild>
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                )}
                {Role === 'Counselor' && (
                  <div className="hidden md:flex items-center gap-2">
                    <Link to="/counselor">
                      <Button asChild>
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                )}
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 rounded-full hover:bg-gray-100 transition-colors p-1 h-auto">
                        <Avatar className="h-9 w-9 border-2 border-teal-500">
                          <AvatarImage src={userInfo?.image || "/avatar.jpg"} alt="User Avatar" />
                          <AvatarFallback>{userInfo?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline-block font-medium">{userInfo?.name || "User"}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel className="font-semibold">Your account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Cài đặt</span>
                      </DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            }
          </div>
        </div>
      </nav>


      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <div className="mx-auto py-6 px-4">
          <Outlet />
        </div>
      </main>
      {isHomePage && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Book Consultation</h3>
                  <p className="text-sm text-gray-600 mb-4">Schedule online or in-person consultation</p>
                  <Button className="w-full" asChild>
                    <Link to="/consultations/book">Book Now</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">STI Testing</h3>
                  <p className="text-sm text-gray-600 mb-4">Book confidential STI testing</p>
                  <Button className="w-full" asChild>
                    <Link to="/testing/book">Schedule Test</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Ask Questions</h3>
                  <p className="text-sm text-gray-600 mb-4">Get answers from our experts</p>
                  <Button className="w-full" asChild>
                    <Link to="/questions/ask">Ask Now</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Track Cycle</h3>
                  <p className="text-sm text-gray-600 mb-4">Monitor your reproductive health</p>
                  <Button className="w-full" asChild>
                    <Link to="/profile">Start Tracking</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}




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
