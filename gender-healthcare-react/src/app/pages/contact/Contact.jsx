import React, { useEffect, useState } from "react";
import { medicalfacilitiesAPI } from "../../services/api";
import { FiMail, FiPhone, FiMapPin, FiClock, FiCalendar } from "react-icons/fi";
import "./Contact.css";

function Contact() {
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    medicalfacilitiesAPI.getAll().then((res) => {
      // Giả sử chỉ có 1 bệnh viện, lấy phần tử đầu tiên
      setFacility(res.data[0]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="contact-loading">Đang tải thông tin bệnh viện...</div>
    );
  }

  if (!facility) {
    return (
      <div className="contact-error">Không tìm thấy thông tin bệnh viện.</div>
    );
  }

  return (
    <div className="contact-container">
      <div className="contact-card">
        <img
          src={facility.image}
          alt={facility.name}
          className="contact-image"
        />
        <div className="contact-info">
          <h2 className="contact-title">{facility.name}</h2>
          <p className="contact-desc">{facility.description}</p>
          <div className="contact-details">
            <div className="contact-detail">
              <FiMapPin className="contact-icon" />
              <span>{facility.address}</span>
            </div>
            <div className="contact-detail">
              <FiPhone className="contact-icon" />
              <span>{facility.phone}</span>
            </div>
            <div className="contact-detail">
              <FiMail className="contact-icon" />
              <span>{facility.email}</span>
            </div>
            <div className="contact-detail">
              <FiClock className="contact-icon" />
              <span>Giờ mở cửa: {facility.openingHours}</span>
            </div>
            <div className="contact-detail">
              <FiCalendar className="contact-icon" />
              <span>Năm thành lập: {facility.establishedYear}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-map">
        {/* Nhúng Google Maps nếu muốn, thay địa chỉ bằng facility.address */}
        <iframe
          title="Bản đồ bệnh viện"
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            facility.address
          )}&output=embed`}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default Contact;
