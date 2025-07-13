import { useEffect, useState } from 'react';
import { counselorScheduleAPI } from '../../../../services/api';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export default function OverviewSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const timeSlots = [ '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  const weekDays = [...Array(7)].map((_, i) => dayjs().startOf('week').add(i + 1, 'day'));

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
        console.error('Error fetching schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading weekly schedule...</p>;

  return (
    <div className="space-y-6 flex flex-col items-center">
      <h3 className="text-2xl font-bold text-gray-800 text-left">
        This Week's Schedule Overview
      </h3>

      <div className="overflow-x-auto w-full max-w-6xl border border-gray-200 rounded-xl shadow-lg bg-white">
        <table className="min-w-max border-collapse text-sm w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800">
            <tr>
              <th className="sticky left-0 z-10 bg-white border-r border-gray-300 p-4 text-left font-semibold shadow-right">
                Time
              </th>
              {weekDays.map((d, idx) => (
                <th
                  key={idx}
                  className="p-4 text-center border-b border-l border-gray-300 font-semibold"
                >
                  {d.format('dddd')}
                  <br />
                  <span className="text-xs text-gray-500">{d.format('DD/MM')}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {timeSlots.map((time) => (
              <tr key={time} className="hover:bg-gray-50 transition-all">
                <td className="sticky left-0 z-10 bg-gray-50 border-r border-t border-gray-300 p-4 font-medium shadow-right">
                  {time}
                </td>
                {weekDays.map((day, idx) => {
                  const matched = schedules.find((s) => {
                    const start = dayjs(s.startTime);
                    return (
                      start.format('HH:mm') === time &&
                      start.isSame(day, 'day')
                    );
                  });

                  return (
                    <td
                      key={`${time}-${idx}`}
                      className="text-center p-3 border-t border-l border-gray-200"
                    >
                      {matched ? (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow transition-all duration-150 
                            ${matched.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : matched.status === 'booked'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-200 text-gray-600'}
                          `}
                        >
                          {matched.status.charAt(0).toUpperCase() + matched.status.slice(1)}
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
