import { NavLink } from 'react-router-dom';
import { Home, Calendar, FileText, Users, Settings } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { label: 'Dashboard', icon: <Home />, path: '/counselor/dashboard' },
    { label: 'Schedule', icon: <Calendar />, path: '/counselor/schedule' },
    { label: 'Blog', icon: <FileText />, path: '/counselor/blog' },
    { label: 'Users', icon: <Users />, path: '/counselor/users' },
    { label: 'Settings', icon: <Settings />, path: '/counselor/settings' },
  ];

  return (
    <div className="p-4 w-64 bg-white border-r">
      <h2 className="text-xl font-bold mb-6">Counselor</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md ${
                  isActive ? 'bg-gray-200 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
