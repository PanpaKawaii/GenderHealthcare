import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [userName, setUserName] = useState('Counselor');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const userId = localStorage.getItem('UserId');
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_URL}/accounts/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUserName(data.name || 'Counselor');
        }
      } catch (err) {
        console.error('❌ Error fetching user info:', err);
      }
    };

    fetchUserInfo();
  }, []);

  const cards = [
    {
      title: 'Schedule',
      description: 'Manage your weekly counseling appointments.',
      icon: '📅',
      link: '/counselor/schedule',
    },
    {
      title: 'Blog & Articles',
      description: 'Share knowledge through articles and updates.',
      icon: '📝',
      link: '/counselor/blog',
    },
    {
      title: 'Forum',
      description: 'Join and answer user questions.',
      icon: '💬',
      link: '/counselor/forum',
    },
    {
      title: 'Profile',
      description: 'Update your information & credentials.',
      icon: '👤',
      link: '/counselor/profile',
    },
  ];

return (
  <div className="min-h-screen bg-[#f5f9fc] px-6 py-12">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-10">
        Welcome back, {userName}.
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.link)}
            className="bg-white cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 rounded-xl px-6 py-8 text-center group border border-gray-100"
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
              {card.title}
            </h3>
            <p className="text-gray-500 text-sm mt-2">{card.description}</p>

            <div className="mt-6">
              <button className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-4 py-1.5 rounded-md transition-all">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

}
