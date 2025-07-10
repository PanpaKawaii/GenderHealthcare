import React, { useEffect, useState } from 'react';
import { counselorScheduleAPI } from '../../../services/api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function CounselorDoctor({ date, slot, onSelectDoctor }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const formattedDate = dayjs(date).format('YYYY-MM-DD');

  useEffect(() => {
    const fetchAvailableDoctors = async () => {
      if (!date || !slot?.startTime || !slot?.endTime) return;

      setLoading(true);
      try {
        const res = await counselorScheduleAPI.getAvailableCounselors(
          formattedDate,
          slot.startTime,
          slot.endTime
        );
        setDoctors(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bác sĩ:', error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDoctors();
  }, [date, slot]);

  const handleSelectDoctor = async (doctor) => {
    try {
      const res = await counselorScheduleAPI.getByCounselorAndDate(
        doctor._id,
        formattedDate
      );
      const schedules = res.data;
      console.log('📦 Schedules returned:', schedules.length);

      const expectedStartTime = dayjs.tz(
        `${dayjs(date).format('YYYY-MM-DD')}T${slot.startTime}`,
        'Asia/Ho_Chi_Minh'
      );

      const matchedSchedule = schedules.find((s) => {
        const dbTime = dayjs(s.startTime);
        const isEqual = dbTime.isSame(expectedStartTime, 'minute') && s.status === 'available';

        console.log('🔎 DB:', dbTime.format(), '| EXPECTED:', expectedStartTime.format(), '| Match:', isEqual);
        return isEqual;
      });

      if (matchedSchedule) {
        onSelectDoctor(doctor, matchedSchedule);
      } else {
        alert('❌ Bác sĩ này không còn slot trống vào giờ đã chọn.');
      }
    } catch (err) {
      console.error('❌ Lỗi khi tìm slot:', err);
      alert('Đã xảy ra lỗi khi kiểm tra slot');
    }
  };

  // Lọc theo tên bác sĩ
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.accountId.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 🔍 Thanh tìm kiếm */}
      {doctors.length > 0 && (
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Find by name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-10 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 outline-none"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <i className="fa fa-search" />
          </span>
        </div>
      )}
      {!loading && (
        <div className="text-sm text-gray-500 text-center">
          {filteredDoctors.length > 0
            ? `Found ${filteredDoctors.length} counselor${filteredDoctors.length > 1 ? 's. Scroll to view.' : ''}`
            : ''}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading counselor list...</p>
      ) : filteredDoctors.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">No counselor available.</p>
      ) : (
        <div className="space-y-4">
          {filteredDoctors.map((doctor, index) => (
            <div key={doctor._id} className="space-y-4">
              <div className="flex items-start gap-4 p-4">
                <img
                  src={doctor.accountId.image || '/default-doctor.jpg'}
                  alt={doctor.accountId.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-bold text-gray-800">
                    {doctor.accountId.name}
                  </h3>
                  <p className="text-gray-600">{doctor.degree}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>★ {doctor.experience} years of experience</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-blue-600 font-bold text-lg">150$</div>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => handleSelectDoctor(doctor)}
                  >
                    Choose counselor
                  </button>
                </div>
              </div>
              {filteredDoctors.length > 1 && index < filteredDoctors.length - 1 && (
                <hr className="w-full border-t border-gray-200" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
