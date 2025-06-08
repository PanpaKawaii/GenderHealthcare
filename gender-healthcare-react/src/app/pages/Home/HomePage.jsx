import React from "react";
import heroesImage from "../../assets/heroes.jpg";
import doctorImage from "../../assets/doctor.jpg";

function HomePage() {
  return (
    <main
      style={{
        background: "#f6f8fa",
        minHeight: "100vh",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {/* thanh navbar fake */}
      <a
        href="/login"
        style={{
          margin: "0 16px",
          color: "#fff",
          background: "#457b9d",
          padding: "8px 20px",
          borderRadius: 8,
        }}
      >
        Đăng nhập
      </a>

      <a
        href="/dashboardDoctor"
        style={{
          margin: "0 16px",
          color: "#fff",
          background: "#457b9d",
          padding: "8px 20px",
          borderRadius: 8,
        }}
      >
        Dashboard
      </a>

      {/* Hero Section */}
      <section style={{ background: "#a8dadc", padding: "54px 0 36px 0" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1 style={{ fontSize: 38, color: "#1d3557", marginBottom: 16 }}>
              Quản lý dịch vụ chăm sóc sức khỏe giới tính <br /> Toàn diện &
              Nhân văn
            </h1>
            <p style={{ fontSize: 20, color: "#1d3557", maxWidth: 540 }}>
              Hỗ trợ đặt lịch, tư vấn, quản lý hồ sơ sức khỏe và kết nối chuyên
              gia. Bảo mật, cá nhân hóa, đồng hành cùng bạn trên hành trình chăm
              sóc sức khỏe giới tính.
            </p>
            <div style={{ marginTop: 32 }}>
              <a
                href="/register"
                style={{
                  background: "#1d3557",
                  color: "#fff",
                  padding: "14px 32px",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                Đăng ký ngay
              </a>
            </div>
          </div>
          <img
            src={heroesImage}
            alt="Healthcare Illustration"
            style={{
              width: 340,
              borderRadius: 20,
              boxShadow: "0 6px 24px rgba(69,123,157,0.12)",
            }}
          />
        </div>
      </section>

      {/* Core Services */}
      <section id="services" style={{ background: "#fff", padding: "48px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              color: "#1d3557",
              fontSize: 28,
              textAlign: "center",
              marginBottom: 36,
            }}
          >
            Dịch vụ nổi bật
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 32,
            }}
          >
            <ServiceCard
              icon="📅"
              title="Đặt lịch khám"
              desc="Chọn chuyên gia, đặt lịch nhanh chóng, nhận nhắc nhở tự động."
            />
            <ServiceCard
              icon="📝"
              title="Quản lý hồ sơ sức khỏe"
              desc="Truy cập, cập nhật và tải về hồ sơ sức khỏe cá nhân an toàn."
            />
            <ServiceCard
              icon="💬"
              title="Tư vấn trực tuyến"
              desc="Kết nối với chuyên gia qua chat/video call, bảo mật tuyệt đối."
            />
            <ServiceCard
              icon="🔔"
              title="Nhắc nhở & Theo dõi"
              desc="Nhận nhắc nhở dùng thuốc, tái khám, theo dõi tiến trình điều trị."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ background: "#f1faee", padding: "48px 0" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 48,
          }}
        >
          <img
            src={doctorImage}
            alt="Inclusive"
            style={{ width: 320, borderRadius: 16 }}
          />
          <div>
            <h3 style={{ color: "#1d3557", fontSize: 24, marginBottom: 18 }}>
              Vì một hệ sinh thái sức khỏe giới tính toàn diện
            </h3>
            <ul style={{ color: "#457b9d", fontSize: 18, lineHeight: 1.7 }}>
              <li>
                Chăm sóc cá nhân hóa, tôn trọng bản dạng giới và quyền riêng tư.
              </li>
              <li>Thông tin minh bạch, dễ tiếp cận, hỗ trợ đa kênh.</li>
              <li>Giao diện thân thiện, tối ưu cho mọi thiết bị.</li>
              <li>Đội ngũ chuyên gia đồng hành, hỗ trợ tận tâm.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

function ServiceCard({ icon, title, desc }) {
  return (
    <div
      style={{
        background: "#f6f8fa",
        borderRadius: 16,
        padding: 32,
        flex: 1,
        boxShadow: "0 2px 12px rgba(69,123,157,0.06)",
        minWidth: 220,
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
      <div
        style={{
          fontWeight: 600,
          fontSize: 20,
          color: "#1d3557",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div style={{ color: "#457b9d", fontSize: 16 }}>{desc}</div>
    </div>
  );
}

export default HomePage;
