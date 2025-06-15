import React, { useState } from 'react';
import Sidebar from './pages/Sidebar';
import Dashboard from './pages/Dashboard'; // NEW: dashboard content
import Schedule from './pages/Schedule';
import Blog from './pages/Blog';
import Users from './pages/ManageAuth';
import Settings from './pages/Settings';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'schedule':
        return <Schedule />;
      case 'blog':
        return <Blog />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex ">
      {/* <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /> */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {renderContent()}
      </main>
    </div>
  );
}
