import React, { useEffect, useState } from 'react';
import { counselorAPI } from '../../../services/api';
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaUserTie, FaCheckCircle, 
         FaTimesCircle, FaGraduationCap, FaBriefcase, FaBook, FaCalendarAlt, 
         FaHistory, FaCamera } from 'react-icons/fa';

// ... (import như cũ)

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('UserId');
        const res = await counselorAPI.getAll();
        const data = res.data.find(c => c.accountId?._id === userId);
        if (data) setUserInfo(data);
        else console.error('❌ Counselor not found');
      } catch (err) {
        console.error('❌ Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p>Loading information...</p>;
  if (!userInfo) return <p>User information not found.</p>;

  const account = userInfo.accountId;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-[#9f99d1] via-[#dbaad7] to-[#f6beb0] text-white p-8 rounded-t-lg shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center z-10 relative">
          {/* Avatar */}
          <div className="md:mr-8 mb-4 md:mb-0 relative">
            {account?.image ? (
              <img src={account.image} alt="Profile" className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-lg" />
            ) : (
              <div className="w-40 h-40 bg-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <FaUser size={60} className="text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
              <FaCamera className="text-gray-500" size={18} />
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{account?.name || userInfo.name}</h1>
            <div className="flex items-center mb-2 text-sm">
              <FaUserTie className="mr-2" />
              <span>{account?.role || 'Counselor'}</span>
              {account?.isActive && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded ml-2 flex items-center">
                  <FaCheckCircle className="mr-1" /> Active
                </span>
              )}
            </div>
        
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-6 rounded-b-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
          Personal & Professional Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <InfoRow icon={<FaEnvelope />} label="Email" value={account?.email} />
            <InfoRow icon={<FaPhone />} label="Phone" value={account?.phone || userInfo.phone} />
            <InfoRow icon={<FaVenusMars />} label="Gender" value={account?.gender} />
            <InfoRow icon={<FaUserTie />} label="Role" value={account?.role || 'Counselor'} />
          </div>

          <div className="space-y-4">
            <InfoRow icon={<FaGraduationCap />} label="Degree" value={userInfo.degree} />
            <InfoRow icon={<FaBriefcase />} label="Experience" value={userInfo.experience ? `${userInfo.experience} years` : null} />
            <InfoRow icon={<FaBook />} label="Biography" value={userInfo.bio} multiline />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable InfoRow component
function InfoRow({ icon, label, value, multiline }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center text-gray-700 font-medium mb-1">
        <span className="mr-3 text-blue-600">{icon}</span>
        {label}
      </div>
      {value ? (
        <p className={`ml-8 text-gray-800 ${multiline ? 'whitespace-pre-wrap' : ''}`}>{value}</p>
      ) : (
        <p className="ml-8 text-gray-400 italic">Not updated</p>
      )}
    </div>
  );
}

