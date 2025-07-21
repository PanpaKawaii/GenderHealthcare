import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ForumComponents/ui/card";
import { Badge } from "../../components/ForumComponents/ui/badge";
import { CalendarIcon, Clock, Loader2, Star } from "lucide-react";
import { counselorBookAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const accountId = localStorage.getItem("UserId");

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!accountId) return;

      setLoading(true);
      try {
        const res = await counselorBookAPI.getByCustomerAccountId(accountId);
        const raw = res.data;

        const now = new Date();
        const updated = [];

        // Auto-update status nếu đã quá giờ
        for (const booking of raw) {
          const endTime = new Date(booking?.scheduleId?.endTime);
          if (
            booking.status === "confirmed" &&
            endTime < now
          ) {
            await counselorBookAPI.update(booking._id, { status: "missed" });
            booking.status = "missed";
            console.log(`⏰ Auto-marked ${booking._id} as missed`);
          }
          updated.push(booking);
        }

        const sorted = updated.sort((a, b) => {
          const aTime = new Date(a.scheduleId?.startTime);
          const bTime = new Date(b.scheduleId?.startTime);
          return bTime - aTime;
        });

        const mapped = sorted.map((booking) => {
          const doctor = booking.scheduleId?.counselorId?.accountId;
          const start = booking.scheduleId?.startTime;
          const end = booking.scheduleId?.endTime;

          return {
            id: booking._id,
            doctor: doctor?.name || "Unknown",
            specialty: booking.scheduleId?.counselorId?.degree || "General",
            date: start
              ? new Date(start).toLocaleDateString("vi-VN")
              : "N/A",
            time:
              start && end
                ? `${new Date(start).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${new Date(end).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "N/A",
            status: booking.status || "unknown",
            notes: booking.note || "",
            rating: booking.rating || 0,
            feedback: booking.feedback || "",
          };
        });

        setAppointments(mapped);
      } catch (err) {
        console.error("❌ Lỗi khi tải lịch sử booking:", err);
        setError("Không thể tải dữ liệu lịch sử.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [accountId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "missed":
        return <Badge className="bg-yellow-100 text-yellow-800">Missed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderStars = (count) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          strokeWidth={1.5}
          className={`${
            i <= count
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>
              View your upcoming and past appointments
            </CardDescription>
          </div>
          {appointments.length > 0 && (
            <div className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">
              {appointments.length}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-base">
                          {appointment.doctor}
                        </h3>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {appointment.specialty}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{appointment.date}</span>
                        <Clock className="h-4 w-4 ml-3" />
                        <span>{appointment.time}</span>
                      </div>

                      {appointment.notes && (
                        <p className="mt-2 text-sm text-gray-700">
                          <span className="font-medium">Notes:</span>{" "}
                          {appointment.notes}
                        </p>
                      )}

                      <div className="mt-3 text-sm flex justify-between items-center">
                        {appointment.rating > 0 ? (
                          <div className="flex">
                            {renderStars(appointment.rating)}
                          </div>
                        ) : (
                          <div />
                        )}

                        <button
                          onClick={() =>
                            navigate(`/bookings/${appointment.id}`)
                          }
                          className="text-sm text-indigo-600 font-medium hover:underline"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No appointment history available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
