import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Helper để định dạng tiền tệ
const formatCurrency = (num) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

// --- Component Biểu đồ (Tái sử dụng cho cả Bar và Line) ---
const RevenueChart = ({ title, type, data }) => {
  const ChartComponent = type === 'bar' ? Bar : Line;
  const options = {
    responsive: true,
    plugins: {
      legend: { display: data.datasets.length > 1 },
      title: { display: true, text: title },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) =>
            new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(value),
        },
      },
    },
  };
  return <ChartComponent data={data} options={options} />;
};

// --- Component Dashboard chính ---
function FinancialDashboard() {
  // State để lưu dữ liệu gốc từ các API
  const [consultationBookings, setConsultationBookings] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [doctorTestServices, setDoctorTestServices] = useState([]);
  const [testServices, setTestServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL API, nên đặt trong file .env để dễ quản lý
  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        // Gọi đồng thời tất cả các API cần thiết để xử lý ở frontend
        const [consultationRes, testResultRes, doctorTestServiceRes, testServiceRes] =
          await Promise.all([
            axios.get(`${API_URL}/consultationbooking`, config),
            axios.get(`${API_URL}/testresults`, config),
            axios.get(`${API_URL}/doctortestservices`, config), // API để kết nối
            axios.get(`${API_URL}/testservices`, config),      // API để lấy giá
          ]);

        setConsultationBookings(consultationRes.data || []);
        setTestResults(testResultRes.data || []);
        setDoctorTestServices(doctorTestServiceRes.data || []);
        setTestServices(testServiceRes.data || []);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sử dụng useMemo để tính toán, chỉ chạy lại khi dữ liệu gốc thay đổi
 const financialData = useMemo(() => {
    if (loading) return null;

    // === BƯỚC 1: TẠO CÁC BẢN ĐỒ TRA CỨU ĐỂ TĂNG TỐC ===

    const doctorToTestServiceMap = new Map();
    doctorTestServices.forEach((dts) => {
      // SỬA Ở ĐÂY: Lấy `_id` từ object `testServiceId` thay vì lấy cả object
      if (dts.testServiceId && dts.testServiceId._id) {
          doctorToTestServiceMap.set(dts._id, dts.testServiceId._id);
      }
    });

    const testServicePriceMap = new Map();
    testServices.forEach((ts) => {
      testServicePriceMap.set(ts._id, ts.price);
    });

    // === BƯỚC 2: TÍNH TOÁN DOANH THU ===
    const consultationRevenue = consultationBookings
      .filter((b) => b.status === 'completed' && b.scheduleId?.price)
      .reduce((sum, b) => sum + b.scheduleId.price, 0);

    const testRevenue = testResults
      .filter(
        (r) =>
          r.testBookingId &&
          (r.testBookingId.status === 'Approved' || r.testBookingId.status === 'Finished')
      )
      .reduce((sum, r) => {
        const doctorTestServiceId = r.testBookingId.doctorTestServiceId;
        const testServiceId = doctorToTestServiceMap.get(doctorTestServiceId);
        const price = testServicePriceMap.get(testServiceId);
        
        // Console log này sẽ hiển thị kết quả đúng sau khi sửa
        console.log(`Booking ID: ${r.testBookingId._id}, Price Found: ${price}`);

        return price ? sum + price : sum;
      }, 0);

    const totalRevenue = consultationRevenue + testRevenue;

    // === BƯỚC 3: CHUẨN BỊ DỮ LIỆU CHO CÁC BIỂU ĐỒ ===
    const revenueByServiceChartData = {
      labels: ['Tư vấn', 'Xét nghiệm'],
      datasets: [
        {
          label: 'Doanh thu',
          data: [consultationRevenue, testRevenue],
          backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)'],
          borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1,
        },
      ],
    };

    // Chuẩn bị dữ liệu doanh thu theo tháng
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = {};

    // Initialize all months to 0
    for (let m = 1; m <= 12; m++) {
      monthlyRevenue[`${m}/${currentYear}`] = 0;
    }

    // Add consultation revenue
    consultationBookings
      .filter(
        (b) =>
          b.status === 'completed' &&
          b.scheduleId?.price &&
          new Date(b.updatedAt).getFullYear() === currentYear
      )
      .forEach((b) => {
        const date = new Date(b.updatedAt);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthlyRevenue[monthYear] += b.scheduleId.price;
      });

    // Add test revenue
    testResults
      .filter(
        (r) =>
          r.testBookingId &&
          (r.testBookingId.status === 'Approved' || r.testBookingId.status === 'Finished') &&
          new Date(r.updatedAt).getFullYear() === currentYear
      )
      .forEach((r) => {
        const doctorTestServiceId = r.testBookingId.doctorTestServiceId;
        const testServiceId = doctorToTestServiceMap.get(doctorTestServiceId);
        const price = testServicePriceMap.get(testServiceId);
        if (price) {
          const date = new Date(r.updatedAt);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          monthlyRevenue[monthYear] += price;
        }
      });

    const sortedMonths = Array.from({ length: 12 }, (_, i) => `${i + 1}/${currentYear}`);

    const revenueByMonthChartData = {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Doanh thu',
          data: sortedMonths.map((month) => monthlyRevenue[month]),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          fill: true,
          tension: 0.1,
        },
      ],
    };

    return {
      totalRevenue,
      consultationRevenue,
      testRevenue,
      revenueByServiceChartData,
      revenueByMonthChartData,
    };
  }, [loading, consultationBookings, testResults, doctorTestServices, testServices]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải và xử lý dữ liệu...</div>;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Dashboard Doanh thu</h1>

      {/* --- Phần Thống kê nhanh --- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>Tổng Doanh thu</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {formatCurrency(financialData.totalRevenue)}
          </p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h4>Doanh thu Tư vấn</h4>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {formatCurrency(financialData.consultationRevenue)}
          </p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h4>Doanh thu Xét nghiệm</h4>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {formatCurrency(financialData.testRevenue)}
          </p>
        </div>
      </div>

      {/* --- Phần Biểu đồ --- */}
      <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <RevenueChart title="Doanh thu theo tháng" type="line" data={financialData.revenueByMonthChartData} />
      </div>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <RevenueChart title="Tỷ trọng doanh thu theo dịch vụ" type="bar" data={financialData.revenueByServiceChartData} />
      </div>
    </div>
  );
}

export default FinancialDashboard;