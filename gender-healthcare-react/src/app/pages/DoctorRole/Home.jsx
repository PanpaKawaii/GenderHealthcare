import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Blog from "./pages/Blog";
import Users from "./pages/ManageAuth";
// import Profile from "./pages/Profile";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Gọi API để lấy tên người dùng
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
        const userId = localStorage.getItem("UserId");
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/accounts/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserName(data.name || "Counselor");
        } else {
          console.error("❌ Failed to fetch user info");
        }
      } catch (err) {
        console.error("❌ Error fetching user info:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const dashboardCards = [
    {
      title: "Lịch làm việc",
      description: "Quản lý và xem lịch hẹn tư vấn.",
      link: "/counselor/schedule",
    },
    {
      title: "Bài viết & Blog",
      description: "Quản lý bài viết và chia sẻ kiến thức.",
      link: "/counselor/blog",
    },
    {
      title: "Diễn đàn",
      description: "Tham gia trả lời các câu hỏi trên diễn đàn.",
      link: "/counselor/forum",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4">
              👋 Welcome back, {userName}!
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {dashboardCards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => navigate(card.link)}
                  className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border hover:border-blue-500"
                >
                  <h2 className="text-xl font-semibold text-blue-600 mb-2">
                    {card.title}
                  </h2>
                  <p className="text-gray-600">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "schedule":
        return <Schedule />;
      case "blog":
        return <Blog />;
      case "users":
        return <Users />;
      case "profiles":
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar nếu cần */}
      {/* <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /> */}

      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {renderContent()}
      </main>
    </div>
  );
}
