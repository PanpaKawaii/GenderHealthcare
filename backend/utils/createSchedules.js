const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const ConsultationSchedule = require('../models/consultationSchedule.model');

// ─── Cấu hình Dayjs ────────────────────────────────────────────────────────────
dotenv.config();
dayjs.extend(utc);
dayjs.extend(timezone);

// ─── Hằng số cấu hình ─────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;
const PRICE_PER_SLOT = 150;

// Các khung giờ theo giờ Việt Nam
const slotTimes = [
  { startTime: '09:00', endTime: '10:00' },
  { startTime: '10:00', endTime: '11:00' },
  { startTime: '11:00', endTime: '12:00' },
  { startTime: '14:00', endTime: '15:00' },
  { startTime: '15:00', endTime: '16:00' },
  { startTime: '16:00', endTime: '17:00' },
];

// Danh sách ID counselor
const counselors = [
  '68454646bcf21a30bec7c720',
  '6845464ebcf21a30bec7c722',
  '684ae1956335fb74f1ccdbdd',
  '684ae1956335fb74f1ccdbde',
  '684ae1956335fb74f1ccdbdf',
  '684ae1956335fb74f1ccdbe0',
  '684ae1956335fb74f1ccdbe1',
];

// ─── Hàm tạo Date chuẩn UTC từ giờ Việt Nam ───────────────────────────────────
const makeDateTime = (date, time) => {
  const localTime = dayjs.tz(`${date.format('YYYY-MM-DD')}T${time}`, 'Asia/Ho_Chi_Minh');
  return localTime.toDate(); // toDate() là UTC ISO date lưu vào Mongo
};

// ─── Sinh dữ liệu lịch ────────────────────────────────────────────────────────
const generateSchedules = async () => {
  const bulk = [];

  for (const counselorId of counselors) {
    for (let d = 0; d < 5; d++) {
      const date = dayjs('2025-07-09').add(d, 'day'); // từ 09–13/07

      for (const slot of slotTimes) {
        bulk.push({
          counselorId,
          startTime: makeDateTime(date, slot.startTime),
          endTime: makeDateTime(date, slot.endTime),
          status: 'available',
          note: `Auto generated ${date.format('DD/MM/YYYY')}`,
          price: PRICE_PER_SLOT,
        });
      }
    }
  }

  await ConsultationSchedule.insertMany(bulk);
  console.log(`✅ Đã tạo ${bulk.length} lịch tư vấn`);
};

// ─── Kết nối MongoDB và thực thi ──────────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('🔗 Đã kết nối MongoDB');
    await generateSchedules();
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ MongoDB lỗi kết nối:', err);
    process.exit(1);
  });
