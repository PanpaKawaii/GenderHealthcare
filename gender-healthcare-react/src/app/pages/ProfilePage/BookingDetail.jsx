import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { counselorBookAPI } from "../../services/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ForumComponents/ui/card";
import { Loader2, Star } from "lucide-react";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await counselorBookAPI.getById(id);
        setBooking(res.data);
        setRating(res.data.rating || 0);
        setFeedback(res.data.feedback || "");
      } catch (error) {
        console.error("❌ Lỗi khi lấy chi tiết booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleSubmitReview = async () => {
    try {
      setSaving(true);
      await counselorBookAPI.update(id, { rating, feedback });
      alert("Đã gửi đánh giá thành công.");
      const res = await counselorBookAPI.getById(id);
      setBooking(res.data);
    } catch (err) {
      console.error("❌ Gửi đánh giá thất bại:", err);
      alert("Gửi đánh giá thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const renderStars = (editable = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={22}
            strokeWidth={1.5}
            className={`transition cursor-pointer ${
              (hover || rating) >= i ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
            onMouseEnter={() => editable && setHover(i)}
            onMouseLeave={() => editable && setHover(0)}
            onClick={() => editable && setRating(i)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking)
    return <p className="text-center text-red-500">Không tìm thấy booking</p>;

  const start = booking.scheduleId?.startTime;
  const end = booking.scheduleId?.endTime;
  const startTime = start
    ? new Date(start).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    : "N/A";
  const endTime = end
    ? new Date(end).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    : "N/A";
  const date = start ? new Date(start).toLocaleDateString("vi-VN") : "N/A";

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <button
          onClick={() => navigate("/profile?tab=appointments")} // hoặc '/appointments' nếu đúng route
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Quay lại lịch hẹn
        </button>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Chi tiết lịch hẹn
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 mt-4 text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-y-2">
            <span className="font-medium">Bác sĩ:</span>
            <span>{booking.scheduleId?.counselorId?.accountId?.name}</span>

            <span className="font-medium">Chuyên ngành:</span>
            <span>{booking.scheduleId?.counselorId?.degree}</span>

            <span className="font-medium">Ngày:</span>
            <span>{date}</span>

            <span className="font-medium">Giờ:</span>
            <span>{startTime} - {endTime}</span>

            <span className="font-medium">Trạng thái:</span>
            <span className="capitalize">{booking.status}</span>

            <span className="font-medium">Ghi chú:</span>
            <span>{booking.note || "Không có"}</span>

            <span className="font-medium">Kết quả tư vấn:</span>
            <span>{booking.result || "Chưa có"}</span>
          </div>

          {booking.rating ? (
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-medium mb-2">Đánh giá của bạn:</p>
              {renderStars(false)}
              <p className="mt-2 text-gray-600">{booking.feedback || "Không có nhận xét"}</p>
            </div>
          ) : booking.status === "completed" ? (
            <div className="bg-gray-100 p-4 rounded space-y-3">
              <p className="font-medium">Đánh giá buổi tư vấn:</p>
              {renderStars(true)}
              <textarea
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-indigo-500"
                rows={3}
                placeholder="Viết nhận xét..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="text-right">
                <button
                  onClick={handleSubmitReview}
                  disabled={saving || rating === 0}
                  className={`px-4 py-2 rounded text-white transition ${
                    rating === 0 || saving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {saving ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
