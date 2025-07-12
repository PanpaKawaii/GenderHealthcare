import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { counselorBookAPI, counselorScheduleAPI } from "../../services/api";
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
        console.error("❌ Failed to fetch booking details:", error);
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
      alert("Review submitted successfully.");
      const res = await counselorBookAPI.getById(id);
      setBooking(res.data);
    } catch (err) {
      console.error("❌ Failed to submit review:", err);
      alert("Failed to submit review.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelBooking = async () => {
    const confirmCancel = confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;

    try {
      setSaving(true);
      await counselorBookAPI.update(booking._id, { status: "cancelled" });

      const scheduleId = booking.scheduleId?._id;
      if (scheduleId) {
        await counselorScheduleAPI.update(scheduleId, { status: "available" });
      }

      alert("Appointment has been cancelled.");
      const res = await counselorBookAPI.getById(booking._id);
      setBooking(res.data);
    } catch (error) {
      console.error("❌ Failed to cancel appointment:", error);
      alert("Failed to cancel appointment.");
    } finally {
      setSaving(false);
    }
  };

  const renderStars = (editable = false) => (
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

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking)
    return <p className="text-center text-red-500">Booking not found.</p>;

  const start = booking.scheduleId?.startTime;
  const end = booking.scheduleId?.endTime;
  const startTime = start
    ? new Date(start).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "N/A";
  const endTime = end
    ? new Date(end).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "N/A";
  const date = start ? new Date(start).toLocaleDateString("en-US") : "N/A";

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <button
          onClick={() => navigate("/profile?tab=appointments")}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to Appointments
        </button>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Appointment Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 mt-4 text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-y-2">
            <span className="font-medium">Doctor:</span>
            <span>{booking.scheduleId?.counselorId?.accountId?.name}</span>

            <span className="font-medium">Specialization:</span>
            <span>{booking.scheduleId?.counselorId?.degree}</span>

            <span className="font-medium">Date:</span>
            <span>{date}</span>

            <span className="font-medium">Time:</span>
            <span>{startTime} - {endTime}</span>

            <span className="font-medium">Status:</span>
            <span className="capitalize">{booking.status}</span>

            <span className="font-medium">Note:</span>
            <span>{booking.note || "None"}</span>

            <span className="font-medium">Consultation Result:</span>
            <span>{booking.result || "Not available yet"}</span>
          </div>

          {booking.status === "confirmed" && (
            <div className="text-right">
              <button
                onClick={handleCancelBooking}
                disabled={saving}
                className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700 transition"
              >
                {saving ? "Cancelling..." : "Cancel Appointment"}
              </button>
            </div>
          )}

          {booking.rating ? (
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-medium mb-2">Your Review:</p>
              {renderStars(false)}
              <p className="mt-2 text-gray-600">{booking.feedback || "No comments"}</p>
            </div>
          ) : booking.status === "completed" ? (
            <div className="bg-gray-100 p-4 rounded space-y-3">
              <p className="font-medium">Rate this session:</p>
              {renderStars(true)}
              <textarea
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-indigo-500"
                rows={3}
                placeholder="Write your comments..."
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
                  {saving ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
