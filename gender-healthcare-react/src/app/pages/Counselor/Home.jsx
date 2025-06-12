import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard'; // NEW: dashboard content
import Schedule from './components/Schedule';
import Blog from './components/Blog';
import Users from './components/ManageAuth';
import Settings from './components/Settings';

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
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {renderContent()}
      </main>
    </div>
  );
}
