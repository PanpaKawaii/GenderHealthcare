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
              Management of Gender Healthcare Services <br /> Comprehensive &
              Humane
            </h1>
            <p style={{ fontSize: 20, color: "#1d3557", maxWidth: 540 }}>
              Support for appointment booking, consultations, health record
              management, and specialist connections. Secure, personalized, and
              your companion on your gender healthcare journey.
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
                Join Now
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
            Featured Services
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
              title="Appointment Booking"
              desc="Select a specialist, book appointments quickly, and receive automated reminders."
            />
            <ServiceCard
              icon="📝"
              title="Health Record Management"
              desc="Securely access, update, and download personal health records."
            />
            <ServiceCard
              icon="💬"
              title="Online Consultation"
              desc="Connect with specialists via chat/video call, with absolute privacy."
            />
            <ServiceCard
              icon="🔔"
              title="Reminders & Tracking"
              desc="Receive medication reminders, follow-up appointment notifications, and treatment progress tracking."
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
              Building a Complete Gender Health Ecosystem
            </h3>
            <ul style={{ color: "#457b9d", fontSize: 18, lineHeight: 1.7 }}>
              <li>
                Personalized care, respecting gender identity and privacy.
              </li>
              <li>
                Transparent information, easy accessibility, and multi-channel
                support.
              </li>
              <li>User-friendly interface, optimized for all devices.</li>
              <li>
                Dedicated team of accompanying experts, providing compassionate
                support.
              </li>
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
