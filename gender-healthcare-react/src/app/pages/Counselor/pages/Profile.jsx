import React, { useEffect, useState } from 'react';

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('UserId');

        const res = await fetch(`${API_URL}/accounts/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data)
          setUserInfo(data);
        } else {
          console.error('❌ Failed to fetch profile');
        }
      } catch (err) {
        console.error('❌ Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Đang tải thông tin...</p>;
  if (!userInfo) return <p>Không tìm thấy thông tin người dùng.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">👤 Thông tin cá nhân</h1>
      <div className="space-y-4">
        <div>
          <label className="font-semibold">Họ tên:</label>
          <p>{userInfo.name}</p>
        </div>
        <div>
          <label className="font-semibold">Email:</label>
          <p>{userInfo.email}</p>
        </div>
        <div>
          <label className="font-semibold">Số điện thoại:</label>
          <p>{userInfo.phone || 'Chưa cập nhật'}</p>
        </div>
        <div>
          <label className="font-semibold">Vai trò:</label>
          <p>{userInfo.role}</p>
        </div>
        {/* Thêm các trường khác nếu cần */}
      </div>
    </div>
  );
}
