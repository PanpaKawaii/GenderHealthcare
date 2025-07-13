import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { counselorBookAPI, counselorScheduleAPI } from "../../services/api";
import { Loader2, Star, ArrowLeft, Calendar, Clock, User, Stethoscope, MessageSquare, CheckCircle, XCircle, ShieldCheck, Info } from 'lucide-react';

// --- UI Components (Các thành phần giao diện) ---
// Giữ lại các component UI đã được thiết kế để đảm bảo giao diện đẹp
const Card = ({ children, className = '' }) => (
    <div className={`bg-white  shadow-sm border border-gray-200/80 overflow-hidden ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className = '' }) => (
    <div className={`p-5 sm:p-6 border-b border-gray-200/80 ${className}`}>
        {children}
    </div>
);

const CardTitle = ({ children, className = '' }) => (
    <h2 className={`text-xl font-bold text-gray-900 ${className}`}>
        {children}
    </h2>
);

const CardContent = ({ children, className = '' }) => (
    <div className={`p-5 sm:p-6 ${className}`}>
        {children}
    </div>
);

const InfoRow = ({ icon, label, value, valueClassName = '' }) => (
    <div>
        <p className="text-xs sm:text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">{icon}{label}</p>
        <p className={`text-sm sm:text-base text-gray-800 break-words ${valueClassName}`}>{value}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const statusStyles = {
        confirmed: { icon: <ShieldCheck size={16} />, text: 'Confirmed', color: 'text-green-700 bg-green-100' },
        completed: { icon: <CheckCircle size={16} />, text: 'Completed', color: 'text-blue-700 bg-blue-100' },
        cancelled: { icon: <XCircle size={16} />, text: 'Cancelled', color: 'text-red-700 bg-red-100' },
    };
    const currentStatus = statusStyles[status] || { text: 'Unknown', color: 'text-gray-600 bg-gray-100' };

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${currentStatus.color}`}>
            {currentStatus.icon}
            <span>{currentStatus.text}</span>
        </div>
    );
};

const StarRating = ({ rating, setRating, hover, setHover, editable = false }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
            <Star
                key={i}
                size={32}
                strokeWidth={1.5}
                className={`transition-all duration-200 ${editable ? 'cursor-pointer' : ''} ${
                    (hover || rating) >= i ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                }`}
                onMouseEnter={() => editable && setHover(i)}
                onMouseLeave={() => editable && setHover(0)}
                onClick={() => editable && setRating(i)}
            />
        ))}
    </div>
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, confirmText, saving }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0">
                            <Info className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="mt-0 text-left">
                            <h3 className="text-lg leading-6 font-bold text-gray-900">{title}</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">{children}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 rounded-b-2xl">
                    <button
                        onClick={onConfirm}
                        disabled={saving}
                        className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-300"
                    >
                        {saving && <Loader2 className="animate-spin" size={20} />}
                        {saving ? 'Processing...' : confirmText}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="w-full sm:w-auto inline-flex justify-center rounded-lg bg-white px-4 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main Booking Detail Component (Component chính) ---

export default function BookingDetail() {
    // Khôi phục logic gốc với hook từ react-router-dom
    const { id } = useParams();
    const navigate = useNavigate();

    // Giữ nguyên state và logic ban đầu
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Giữ nguyên logic fetch dữ liệu ban đầu
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

    // Giữ nguyên logic gửi đánh giá ban đầu (bao gồm cả alert)
    const handleSubmitReview = async () => {
        if (rating === 0) return;
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

    // Giữ nguyên logic hủy lịch hẹn ban đầu, nhưng được gọi từ modal
    const handleCancelBooking = async () => {
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
            setIsModalOpen(false);
        }
    };
    
    // Phần hiển thị loading và lỗi được giữ nguyên
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <p className="text-center text-red-500 text-lg">Appointment not found.</p>
            </div>
        );
    }

    // Phần xử lý dữ liệu thời gian được giữ nguyên
    const { scheduleId } = booking;
    const startTime = scheduleId?.startTime ? new Date(scheduleId.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "N/A";
    const endTime = scheduleId?.endTime ? new Date(scheduleId.endTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "N/A";
    const date = scheduleId?.startTime ? new Date(scheduleId.startTime).toLocaleDateString("vi-VN", { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A";

    // Áp dụng giao diện mới cho phần JSX trả về
    return (
        <Fragment>                <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleCancelBooking}
                title="Cancel Appointment"
                confirmText="Yes, cancel appointment"
                saving={saving}
            >
                Are you sure you want to cancel this appointment? This action cannot be undone.
            </ConfirmationModal>

            <div className="bg-slate-50 min-h-screen font-sans">
                <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="mb-6">
                        <button
                            onClick={() => navigate("/profile?tab=appointments")}
                            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Appointments List
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-3 ">
                            <Card>
                                <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                    <div>
                                        <CardTitle>Appointment Details</CardTitle>
                                        <p className="text-sm text-gray-500 mt-1">Booking ID: #{booking._id}</p>
                                    </div>
                                    <StatusBadge status={booking.status} />
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                                    <InfoRow icon={<User size={18} />} label="Doctor" value={scheduleId?.counselorId?.accountId?.name} />
                                    <InfoRow icon={<Stethoscope size={18} />} label="Specialization" value={scheduleId?.counselorId?.degree} />
                                    <InfoRow icon={<Calendar size={18} />} label="Appointment Date" value={date} />
                                    <InfoRow icon={<Clock size={18} />} label="Time" value={`${startTime} - ${endTime}`} />
                                    <InfoRow icon={<MessageSquare size={18} />} label="Your Notes" value={booking.note || "No notes provided."} valueClassName="italic text-gray-600" />
                                     {booking.status !== 'confirmed' && (
                                         <InfoRow icon={<CheckCircle size={18} />} label="Consultation Result" value={booking.result || "Not available yet"} valueClassName="text-gray-600" />
                                     )}
                                </CardContent>
                                {booking.status === "confirmed" && (
                                    <div className="p-6 bg-gray-50/50 border-t border-gray-200/80 flex justify-end">
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            disabled={saving}
                                            className="px-5 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 transition-all flex items-center gap-2"
                                        >
                                            <XCircle size={20} />
                                            Cancel Appointment
                                        </button>
                                    </div>
                                )}
                            </Card>
                            
                            {booking.rating ? (
                                <Card>
                                    <CardHeader><CardTitle>Your Review</CardTitle></CardHeader>
                                    <CardContent>
                                        <StarRating rating={booking.rating} editable={false} />
                                        <p className="mt-4 text-gray-700 italic bg-gray-50 p-4 rounded-lg">"{booking.feedback || "No comment provided."}"</p>
                                    </CardContent>
                                </Card>
                            ) : booking.status === "completed" ? (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Leave a Review</CardTitle>
                                        <p className="text-sm text-gray-500 mt-1">Your feedback helps us improve our services.</p>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <label className="font-semibold text-gray-700 mb-2 block">Rate your consultation</label>
                                            <StarRating rating={rating} setRating={setRating} hover={hover} setHover={setHover} editable={true} />
                                        </div>
                                        <div>
                                            <label htmlFor="feedback" className="font-semibold text-gray-700 mb-2 block">Comment (optional)</label>
                                            <textarea
                                                id="feedback"
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                                                rows={4}
                                                placeholder="Share your experience..."
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                            />
                                        </div>
                                        <div className="text-right pt-2">
                                            <button
                                                onClick={handleSubmitReview}
                                                disabled={saving || rating === 0}
                                                className="px-6 py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 ml-auto"
                                            >
                                                {saving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                                {saving ? "Submitting..." : "Submit Review"}
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
