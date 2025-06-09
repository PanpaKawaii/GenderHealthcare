// import { useState } from "react"

// export default function CounselorSchedule() {
//   const generateWeekSchedule = () => {
//     const days = []
//     const today = new Date()

//     const scheduleData = [
//       {
//         "9:00 AM": {
//           status: "completed",
//           clientName: "Sarah Johnson",
//           clientEmail: "sarah.j@email.com",
//           clientPhone: "(555) 123-4567",
//           appointmentType: "Individual Therapy",
//           notes: "Session completed - discussed anxiety management techniques",
//           duration: "60 min",
//         },
//         "10:00 AM": {
//           status: "booked",
//           clientName: "Michael Chen",
//           clientEmail: "m.chen@email.com",
//           clientPhone: "(555) 234-5678",
//           appointmentType: "Depression Support",
//           notes: "Follow-up session",
//           duration: "60 min",
//         },
//         "11:00 AM": { status: "available" },
//         "12:00 PM": { status: "available" },
//         "1:00 PM": {
//           status: "booked",
//           clientName: "Emma Williams",
//           clientEmail: "emma.w@email.com",
//           clientPhone: "(555) 345-6789",
//           appointmentType: "Couples Therapy",
//           notes: "Session with partner",
//           duration: "90 min",
//         },
//         "2:00 PM": { status: "available" },
//         "3:00 PM": {
//           status: "booked",
//           clientName: "David Brown",
//           clientEmail: "d.brown@email.com",
//           clientPhone: "(555) 456-7890",
//           appointmentType: "Anxiety Counseling",
//           notes: "Regular weekly session",
//           duration: "60 min",
//         },
//         "4:00 PM": {
//           status: "cancelled",
//           clientName: "Lisa Park",
//           appointmentType: "Stress Management",
//           notes: "Client cancelled - rescheduled for next week",
//           duration: "60 min",
//         },
//         "5:00 PM": { status: "available" },
//       },
//       {
//         "9:00 AM": {
//           status: "booked",
//           clientName: "Alex Rodriguez",
//           clientEmail: "alex.r@email.com",
//           clientPhone: "(555) 567-8901",
//           appointmentType: "Individual Therapy",
//           notes: "New client intake session",
//           duration: "90 min",
//         },
//         "10:00 AM": { status: "available" },
//         "11:00 AM": {
//           status: "booked",
//           clientName: "Jennifer Lee",
//           clientEmail: "jen.lee@email.com",
//           clientPhone: "(555) 678-9012",
//           appointmentType: "Grief Counseling",
//           notes: "Third session",
//           duration: "60 min",
//         },
//         "12:00 PM": { status: "available" },
//         "1:00 PM": { status: "available" },
//         "2:00 PM": {
//           status: "booked",
//           clientName: "Robert Wilson",
//           clientEmail: "r.wilson@email.com",
//           clientPhone: "(555) 789-0123",
//           appointmentType: "Family Therapy",
//           notes: "Session with teenage son",
//           duration: "60 min",
//         },
//         "3:00 PM": {
//           status: "booked",
//           clientName: "Maria Garcia",
//           clientEmail: "maria.g@email.com",
//           clientPhone: "(555) 890-1234",
//           appointmentType: "Trauma Therapy",
//           notes: "EMDR session",
//           duration: "60 min",
//         },
//         "4:00 PM": { status: "available" },
//         "5:00 PM": { status: "available" },
//       },
//       {
//         "9:00 AM": { status: "available" },
//         "10:00 AM": {
//           status: "booked",
//           clientName: "Sarah Johnson",
//           clientEmail: "sarah.j@email.com",
//           clientPhone: "(555) 123-4567",
//           appointmentType: "Individual Therapy",
//           notes: "Weekly follow-up",
//           duration: "60 min",
//         },
//         "11:00 AM": {
//           status: "booked",
//           clientName: "Thomas Anderson",
//           clientEmail: "t.anderson@email.com",
//           clientPhone: "(555) 901-2345",
//           appointmentType: "Career Counseling",
//           notes: "Job transition support",
//           duration: "60 min",
//         },
//         "12:00 PM": { status: "available" },
//         "1:00 PM": {
//           status: "booked",
//           clientName: "Emma Williams",
//           clientEmail: "emma.w@email.com",
//           clientPhone: "(555) 345-6789",
//           appointmentType: "Couples Therapy",
//           notes: "Weekly couples session",
//           duration: "90 min",
//         },
//         "2:00 PM": { status: "available" },
//         "3:00 PM": { status: "available" },
//         "4:00 PM": {
//           status: "booked",
//           clientName: "Kevin Murphy",
//           clientEmail: "k.murphy@email.com",
//           clientPhone: "(555) 012-3456",
//           appointmentType: "Addiction Counseling",
//           notes: "Recovery support session",
//           duration: "60 min",
//         },
//         "5:00 PM": { status: "available" },
//       },
//       {
//         "9:00 AM": {
//           status: "booked",
//           clientName: "Rachel Green",
//           clientEmail: "r.green@email.com",
//           clientPhone: "(555) 123-7890",
//           appointmentType: "Individual Therapy",
//           notes: "Bi-weekly session",
//           duration: "60 min",
//         },
//         "10:00 AM": {
//           status: "booked",
//           clientName: "Michael Chen",
//           clientEmail: "m.chen@email.com",
//           clientPhone: "(555) 234-5678",
//           appointmentType: "Depression Support",
//           notes: "Progress check-in",
//           duration: "60 min",
//         },
//         "11:00 AM": { status: "available" },
//         "12:00 PM": {
//           status: "cancelled",
//           clientName: "John Smith",
//           appointmentType: "Anger Management",
//           notes: "Client sick - rescheduled",
//           duration: "60 min",
//         },
//         "1:00 PM": { status: "available" },
//         "2:00 PM": {
//           status: "booked",
//           clientName: "Amanda Taylor",
//           clientEmail: "a.taylor@email.com",
//           clientPhone: "(555) 234-7891",
//           appointmentType: "Eating Disorder Support",
//           notes: "Weekly session",
//           duration: "60 min",
//         },
//         "3:00 PM": {
//           status: "booked",
//           clientName: "David Brown",
//           clientEmail: "d.brown@email.com",
//           clientPhone: "(555) 456-7890",
//           appointmentType: "Anxiety Counseling",
//           notes: "Exposure therapy session",
//           duration: "60 min",
//         },
//         "4:00 PM": { status: "available" },
//         "5:00 PM": { status: "available" },
//       },
//       {
//         "9:00 AM": {
//           status: "booked",
//           clientName: "Steven Clark",
//           clientEmail: "s.clark@email.com",
//           clientPhone: "(555) 345-7892",
//           appointmentType: "PTSD Therapy",
//           notes: "Trauma processing session",
//           duration: "90 min",
//         },
//         "10:00 AM": { status: "available" },
//         "11:00 AM": {
//           status: "booked",
//           clientName: "Jennifer Lee",
//           clientEmail: "jen.lee@email.com",
//           clientPhone: "(555) 678-9012",
//           appointmentType: "Grief Counseling",
//           notes: "Weekly session",
//           duration: "60 min",
//         },
//         "12:00 PM": { status: "available" },
//         "1:00 PM": { status: "available" },
//         "2:00 PM": {
//           status: "booked",
//           clientName: "Robert Wilson",
//           clientEmail: "r.wilson@email.com",
//           clientPhone: "(555) 789-0123",
//           appointmentType: "Family Therapy",
//           notes: "Family session",
//           duration: "60 min",
//         },
//         "3:00 PM": { status: "available" },
//         "4:00 PM": {
//           status: "booked",
//           clientName: "Nicole Davis",
//           clientEmail: "n.davis@email.com",
//           clientPhone: "(555) 456-7893",
//           appointmentType: "Relationship Counseling",
//           notes: "Individual session",
//           duration: "60 min",
//         },
//         "5:00 PM": { status: "available" },
//       },
//       {
//         "9:00 AM": { status: "available" },
//         "10:00 AM": {
//           status: "booked",
//           clientName: "Patricia Moore",
//           clientEmail: "p.moore@email.com",
//           clientPhone: "(555) 567-7894",
//           appointmentType: "Individual Therapy",
//           notes: "Weekend session",
//           duration: "60 min",
//         },
//         "11:00 AM": { status: "available" },
//         "12:00 PM": {
//           status: "booked",
//           clientName: "James White",
//           clientEmail: "j.white@email.com",
//           clientPhone: "(555) 678-7895",
//           appointmentType: "Substance Abuse Counseling",
//           notes: "Recovery session",
//           duration: "60 min",
//         },
//         "1:00 PM": { status: "available" },
//         "2:00 PM": { status: "available" },
//         "3:00 PM": {
//           status: "booked",
//           clientName: "Linda Johnson",
//           clientEmail: "l.johnson@email.com",
//           clientPhone: "(555) 789-7896",
//           appointmentType: "Life Coaching",
//           notes: "Goal setting session",
//           duration: "60 min",
//         },
//         "4:00 PM": { status: "available" },
//         "5:00 PM": { status: "available" },
//       },
//       {
//         "9:00 AM": { status: "available" },
//         "10:00 AM": { status: "available" },
//         "11:00 AM": {
//           status: "booked",
//           clientName: "Christopher Lee",
//           clientEmail: "c.lee@email.com",
//           clientPhone: "(555) 890-7897",
//           appointmentType: "Individual Therapy",
//           notes: "Sunday session",
//           duration: "60 min",
//         },
//         "12:00 PM": { status: "available" },
//         "1:00 PM": { status: "available" },
//         "2:00 PM": {
//           status: "booked",
//           clientName: "Michelle Brown",
//           clientEmail: "m.brown@email.com",
//           clientPhone: "(555) 901-7898",
//           appointmentType: "Mindfulness Therapy",
//           notes: "Meditation session",
//           duration: "60 min",
//         },
//         "3:00 PM": { status: "available" },
//         "4:00 PM": { status: "available" },
//         "5:00 PM": { status: "available" },
//       },
//     ]

//     const timeSlots = [
//       "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
//       "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
//     ]

//     for (let i = 0; i < 7; i++) {
//       const date = new Date(today)
//       date.setDate(today.getDate() + i)

//       const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
//       const dateString = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
//       const fullDate = date.toLocaleDateString("en-US", {
//         weekday: "long", year: "numeric", month: "long", day: "numeric"
//       })

//       const slots = []

//       timeSlots.forEach((time) => {
//         const dayData = scheduleData[i]
//         const slotData = dayData[time]

//         if (slotData) {
//           slots.push({
//             time,
//             status: slotData.status,
//             clientName: slotData.clientName,
//             clientEmail: slotData.clientEmail,
//             clientPhone: slotData.clientPhone,
//             appointmentType: slotData.appointmentType,
//             notes: slotData.notes,
//             duration: slotData.duration || "60 min",
//           })
//         } else {
//           slots.push({ time, status: "available", duration: "60 min" })
//         }
//       })

//       days.push({ date: dateString, dayName, fullDate, slots })
//     }

//     return days
//   }

//   // ... Phần logic JSX và state khác giữ nguyên, chị Nhi sẽ nối tiếp nếu em cần


//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">My Schedule</h1>
//           <p className="text-gray-600">Manage your counseling appointments for the week</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//             <div className="flex items-center">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.booked}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//             <div className="flex items-center">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Completed</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//             <div className="flex items-center">
//               <div className="p-2 bg-yellow-100 rounded-lg">
//                 <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Available Slots</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//             <div className="flex items-center">
//               <div className="p-2 bg-purple-100 rounded-lg">
//                 <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Slots</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Schedule Grid */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="grid grid-cols-1 lg:grid-cols-7 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
//             {weekSchedule.map((day, dayIndex) => (
//               <div key={dayIndex} className="p-4">
//                 {/* Day Header */}
//                 <div className="text-center mb-4 pb-3 border-b border-gray-100">
//                   <h3 className="font-semibold text-gray-900">{day.dayName}</h3>
//                   <p className="text-sm text-gray-500">{day.date}</p>
//                 </div>

//                 {/* Time Slots */}
//                 <div className="space-y-2">
//                   {day.slots.map((slot, slotIndex) => (
//                     <div
//                       key={slotIndex}
//                       onClick={() => handleSlotClick(dayIndex, slotIndex)}
//                       className={`p-3 rounded-lg border text-sm transition-all cursor-pointer hover:shadow-sm ${getStatusColor(slot.status)}`}
//                     >
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="font-medium">{slot.time}</span>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(slot.status)}`}>
//                           {slot.status}
//                         </span>
//                       </div>

//                       {slot.clientName && (
//                         <div className="space-y-1">
//                           <div className="font-medium text-gray-900 truncate">{slot.clientName}</div>
//                           {slot.appointmentType && (
//                             <div className="text-xs text-gray-600 truncate">{slot.appointmentType}</div>
//                           )}
//                           {slot.duration && <div className="text-xs text-gray-500">Duration: {slot.duration}</div>}
//                         </div>
//                       )}

//                       {slot.status === "available" && (
//                         <div className="text-xs text-green-600 mt-1">Available for booking</div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Appointment Details Modal */}
//         {selectedSlot && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>

//               {(() => {
//                 const slot = weekSchedule[selectedSlot.dayIndex].slots[selectedSlot.slotIndex]
//                 const day = weekSchedule[selectedSlot.dayIndex]

//                 return (
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-sm text-gray-600">
//                         <strong>Date:</strong> {day.fullDate}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         <strong>Time:</strong> {slot.time}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         <strong>Status:</strong>
//                         <span
//                           className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(slot.status)}`}
//                         >
//                           {slot.status}
//                         </span>
//                       </p>
//                     </div>

//                     {slot.clientName && (
//                       <div className="border-t pt-4">
//                         <h4 className="font-medium text-gray-900 mb-2">Client Information</h4>
//                         <p className="text-sm text-gray-600">
//                           <strong>Name:</strong> {slot.clientName}
//                         </p>
//                         {slot.clientEmail && (
//                           <p className="text-sm text-gray-600">
//                             <strong>Email:</strong> {slot.clientEmail}
//                           </p>
//                         )}
//                         {slot.clientPhone && (
//                           <p className="text-sm text-gray-600">
//                             <strong>Phone:</strong> {slot.clientPhone}
//                           </p>
//                         )}
//                         {slot.appointmentType && (
//                           <p className="text-sm text-gray-600">
//                             <strong>Type:</strong> {slot.appointmentType}
//                           </p>
//                         )}
//                         {slot.duration && (
//                           <p className="text-sm text-gray-600">
//                             <strong>Duration:</strong> {slot.duration}
//                           </p>
//                         )}
//                       </div>
//                     )}

//                     {slot.notes && (
//                       <div className="border-t pt-4">
//                         <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
//                         <p className="text-sm text-gray-600">{slot.notes}</p>
//                       </div>
//                     )}

//                     {slot.status === "booked" && (
//                       <div className="border-t pt-4">
//                         <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => updateAppointmentStatus("completed")}
//                             className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-sm"
//                           >
//                             Mark Complete
//                           </button>
//                           <button
//                             onClick={() => updateAppointmentStatus("cancelled")}
//                             className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors text-sm"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     <div className="border-t pt-4">
//                       <button
//                         onClick={() => setSelectedSlot(null)}
//                         className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
//                       >
//                         Close
//                       </button>
//                     </div>
//                   </div>
//                 )
//               })()}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
