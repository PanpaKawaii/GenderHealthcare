import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  FileText,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      path: '/admin/moderation',
      name: 'Moderation',
      icon: <Users size={20} />
    },
    {
      path: '/admin/users',
      name: 'Users',
      icon: <LayoutDashboard size={20} />
    }   
    
  ];

  return (
    <div className={`h-screen bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!isCollapsed && <h2 className="text-xl font-bold">Admin Panel</h2>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className={`${isCollapsed ? 'mx-auto' : ''} p-1 rounded-md hover:bg-gray-800`}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <div className="flex flex-col flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 ${
                isActive ? 'bg-blue-700' : 'hover:bg-gray-800'
              } ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
            >
              <div className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</div>
              {!isCollapsed && <span className={isActive ? 'font-medium' : ''}>{item.name}</span>}
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto">
        <Link
          to="/"
          className={`flex items-center px-4 py-3 text-red-400 hover:bg-gray-800 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Exit to Site</span>}
        </Link>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      
      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900">
            <Sidebar isCollapsed={false} setIsCollapsed={() => {}} />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={() => setIsMobileSidebarOpen(true)} className="md:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100">
              <Menu size={24} />
            </button>
            <div className="flex-1 flex justify-end">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">Admin User</span>
                  <span className="text-xs text-gray-500">Administrator</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
