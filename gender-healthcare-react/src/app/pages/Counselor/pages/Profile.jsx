import React, { useEffect, useState } from 'react';
import { counselorAPI } from '../../../services/api';
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaUserTie, FaCheckCircle, 
         FaTimesCircle, FaGraduationCap, FaBriefcase, FaBook, FaCalendarAlt, 
         FaHistory, FaCamera } from 'react-icons/fa';

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('UserId');
        
        const counselorResponse = await counselorAPI.getAll();
        const existingCounselor = counselorResponse.data.find(
          counselor => counselor.accountId && counselor.accountId._id === userId
        );
        console.log('👤 Counselor Profile:', existingCounselor);
        if (existingCounselor) {
          console.log(existingCounselor);
          setUserInfo(existingCounselor);
        } else {
          console.error('❌ Counselor not found for this user');
        }
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

  // CSS for sparkling stars
  const starStyles = `
    @keyframes twinkle {
      0% { opacity: 0.2; }
      50% { opacity: 1; }
      100% { opacity: 0.2; }
    }
  `;

  return (
    <div className="max-w-5xl mx-auto">
      <style>{starStyles}</style>
      <div className="bg-gradient-to-r from-[#9f99d1] via-[#dbaad7] to-[#f6beb0] text-white p-8 rounded-t-lg shadow-lg relative overflow-hidden">
        
        <div className="absolute inset-0" style={{ zIndex: 1, pointerEvents: 'none' }}>
          <div 
            className="absolute" 
            style={{ 
              top: '10%', 
              left: '5%', 
              width: '4px', 
              height: '4px', 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              opacity: 0.7,
              animation: 'twinkle 3s infinite ease-in-out',
            }} 
          />
          <div 
            className="absolute" 
            style={{ 
              top: '25%', 
              left: '15%', 
              width: '3px', 
              height: '3px', 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              opacity: 0.5,
              animation: 'twinkle 4s infinite ease-in-out 0.5s',
            }} 
          />
          <div 
            className="absolute" 
            style={{ 
              top: '15%', 
              right: '10%', 
              width: '2px', 
              height: '2px', 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              opacity: 0.8,
              animation: 'twinkle 3.5s infinite ease-in-out 1s',
            }} 
          />
          <div 
            className="absolute" 
            style={{ 
              top: '40%', 
              right: '20%', 
              width: '3px', 
              height: '3px', 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              opacity: 0.6,
              animation: 'twinkle 5s infinite ease-in-out 0.7s',
            }} 
          />
          <div 
            className="absolute" 
            style={{ 
              bottom: '30%', 
              left: '30%', 
              width: '2px', 
              height: '2px', 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              opacity: 0.7,
              animation: 'twinkle 4s infinite ease-in-out 2s',
            }} 
          />
          <div 
            className="absolute" 
            style={{ 
              bottom: '20%', 
              right: '35%', 
              width: '2px', 
              height: '2px', 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              opacity: 0.5,
              animation: 'twinkle 3s infinite ease-in-out 1.5s',
            }} 
          />
        </div>
        
       
        <div className="flex flex-col md:flex-row items-center relative" style={{ zIndex: 2 }}>
          <div className="md:mr-8 mb-4 md:mb-0 relative">
            {userInfo.accountId?.image ? (
              <img 
                src={userInfo.accountId.image} 
                alt="Profile Photo" 
                className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <FaUser size={60} className="text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
              <FaCamera className="text-gray-500" size={18} />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{userInfo.name || userInfo.accountId?.name}</h1>
            <div className="flex items-center mb-2">
              <FaUserTie className="mr-2" />
              <span>{userInfo.accountId?.role || 'Counselor'}</span>
              {userInfo.accountId?.isActive && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded ml-2 flex items-center">
                  <FaCheckCircle className="mr-1" /> Active
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center text-sm">
              {userInfo.experience && (
                <span className="flex items-center mr-4 mb-2">
                  <FaBriefcase className="mr-1" /> {userInfo.experience} years experience
                </span>
              )}
              {userInfo.degree && (
                <span className="flex items-center mr-4 mb-2">
                  <FaGraduationCap className="mr-1" /> {userInfo.degree}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-b-lg shadow-lg">
        <div className="border-b border-gray-200 mb-6">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'profile' 
                    ? 'text-blue-600 border-blue-600' 
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
              >
                Personal Information
              </button>
            </li>
          </ul>
        </div>
        
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                <span className="text-teal-600 mr-2">Personal Information</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <FaUser className="text-teal-600 mr-3" />
                    <span className="font-medium text-gray-700">Full Name</span>
                  </div>
                  <p className="ml-8 mt-1 text-gray-800">{userInfo.name || userInfo.accountId?.name}</p>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <FaEnvelope className="text-teal-600 mr-3" />
                    <span className="font-medium text-gray-700">Email</span>
                  </div>
                  <p className="ml-8 mt-1 text-gray-800">{userInfo.accountId?.email || 'Not updated'}</p>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <FaPhone className="text-teal-600 mr-3" />
                    <span className="font-medium text-gray-700">Phone Number</span>
                  </div>
                  <p className="ml-8 mt-1 text-gray-800">{userInfo.accountId?.phone || userInfo.phone || 'Not updated'}</p>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <FaVenusMars className="text-teal-600 mr-3" />
                    <span className="font-medium text-gray-700">Gender</span>
                  </div>
                  <p className="ml-8 mt-1 text-gray-800">{userInfo.accountId?.gender || 'Not updated'}</p>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <FaUserTie className="text-teal-600 mr-3" />
                    <span className="font-medium text-gray-700">Role</span>
                  </div>
                  <p className="ml-8 mt-1 text-gray-800">{userInfo.accountId?.role || 'Counselor'}</p>
                </div>
                
                {/* <div className="flex flex-col">
                  <div className="flex items-center">
                    {userInfo.accountId?.isActive ? 
                      <FaCheckCircle className="text-green-500 mr-3" /> : 
                      <FaTimesCircle className="text-red-500 mr-3" />
                    }
                    <span className="font-medium text-gray-700">Account Status</span>
                  </div>
                  <p className="ml-8 mt-1 text-gray-800">
                    {userInfo.accountId?.isActive ? 
                      <span className="text-green-500 font-medium">Active</span> : 
                      <span className="text-red-500 font-medium">Inactive</span>
                    }
                  </p>
                </div> */}
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                <span className="text-blue-600 mr-2">Professional Information</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <FaGraduationCap className="text-blue-600 mr-3" />
                    <span className="font-medium text-gray-700">Degree</span>
                  </div>
                  <p className="ml-8 mt-1 text-gray-800">{userInfo.degree || 'Not updated'}</p>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <FaBriefcase className="text-blue-600 mr-3" />
                    <span className="font-medium text-gray-700">Experience</span>
                  </div>
                  <p className="ml-8 mt-1 text-gray-800">
                    {userInfo.experience ? `${userInfo.experience} years` : 'Not updated'}
                  </p>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <FaBook className="text-blue-600 mr-3" />
                    <span className="font-medium text-gray-700">Biography</span>
                  </div>
                  <p className="ml-8 mt-1 text-gray-800 whitespace-pre-wrap">
                    {userInfo.bio || 'Not updated'}
                  </p>
                </div>
                
                {/* <div className="flex flex-col">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-blue-600 mr-3" />
                    <span className="font-medium text-gray-700">Join Date</span>
                  </div>
                  <p className="ml-8 mt-1 text-gray-800">
                    {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('en-US') : 'No information'}
                  </p>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <FaHistory className="text-blue-600 mr-3" />
                    <span className="font-medium text-gray-700">Last Update</span>
                  </div>
                  <p className="ml-8 mt-1 text-gray-800">
                    {userInfo.updatedAt ? new Date(userInfo.updatedAt).toLocaleDateString('en-US') : 'No information'}
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
