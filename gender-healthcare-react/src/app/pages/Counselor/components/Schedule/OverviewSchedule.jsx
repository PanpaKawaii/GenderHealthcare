import { useEffect, useState } from 'react';
import { counselorScheduleAPI } from '../../../../services/api';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export default function OverviewSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00',
  ];

  const weekDays = [...Array(7)].map((_, i) =>
    dayjs().startOf('week').add(i + 1, 'day')
  );

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const accountId = localStorage.getItem('UserId');
        if (!accountId) return;

        const res = await counselorScheduleAPI.getByAccount(accountId);
        const all = res.data || [];

        const startOfWeek = dayjs().startOf('week').add(1, 'day');
        const endOfWeek = dayjs().endOf('week').add(1, 'day');

        const filtered = all.filter((s) =>
          dayjs(s.startTime).isBetween(startOfWeek, endOfWeek, null, '[]')
        );

        setSchedules(filtered);
      } catch (err) {
        console.error('Lỗi khi lấy schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) return <p className="text-gray-600">Đang tải lịch làm việc...</p>;

return (
    <div className="space-y-4 flex flex-col items-center">
        <h3 className="text-xl font-semibold text-gray-800 text-center">📅 Lịch làm việc tuần này</h3>

        <div className="overflow-x-auto flex justify-center">
            <table className="min-w-max border-collapse shadow rounded-lg overflow-hidden text-sm mx-auto">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="border border-gray-300 p-3 font-medium text-left bg-white sticky left-0 z-10 shadow-right">
                            Giờ
                        </th>
                        {weekDays.map((d, idx) => (
                            <th key={idx} className="border border-gray-300 p-3 text-center min-w-[120px]">
                                {d.format('dddd')}<br />
                                <span className="text-sm text-gray-500">{d.format('DD/MM')}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {timeSlots.map((time) => (
                        <tr key={time} className="hover:bg-gray-50 transition">
                            <td className="border border-gray-300 p-3 font-medium text-left bg-gray-50 sticky left-0 z-10 shadow-right">
                                {time}
                            </td>
                            {weekDays.map((day) => {
                                const matched = schedules.find((s) => {
                                    const start = dayjs(s.startTime);
                                    return (
                                        start.format('HH:mm') === time &&
                                        start.isSame(day, 'day')
                                    );
                                });

                                return (
                                    <td key={day.toString()} className="border border-gray-200 p-2 text-center">
                                        {matched ? (
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-white font-semibold text-xs shadow
                                                    ${
                                                        matched.status === 'available'
                                                            ? 'bg-green-500'
                                                            : matched.status === 'booked'
                                                            ? 'bg-yellow-500'
                                                            : 'bg-gray-500'
                                                    }
                                                `}
                                            >
                                                {matched.status}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
}
