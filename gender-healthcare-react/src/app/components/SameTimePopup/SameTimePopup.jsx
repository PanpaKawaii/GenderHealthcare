import './SameTimePopup.css';

export default function SameTimePopup({ SameTimeBooking, setSameTime }) {
    return (
        <div className='sametimepopup-container'>
            <div className='card'>
                <div className='alert'>You have already had the booking(s) with the same time</div>
                {SameTimeBooking?.length > 0 && (
                    SameTimeBooking?.map((booking, i) => (
                        <div key={i}>
                            <div>Created: {booking.createdAt?.split('T')[0]}</div>
                            <div>Date: {booking.bookingDate?.split('T')[0]}</div>
                            <div>Time: {booking.doctorTestServiceId?.startTime} - {booking.doctorTestServiceId?.endTime}</div>
                            <div>Test: {booking.doctorTestServiceId?.testServiceId?.name}</div>
                            <div>Price: {booking.doctorTestServiceId?.testServiceId?.price}</div>
                            <div>Status: {booking.status}</div>
                            <div>Doctor note: {booking.note || <span className='note'>No note</span>}</div>
                        </div>
                    ))
                )}
                <button className='btn' onClick={() => setSameTime(false)}>Continue?</button>
            </div>
        </div>
    )
}
