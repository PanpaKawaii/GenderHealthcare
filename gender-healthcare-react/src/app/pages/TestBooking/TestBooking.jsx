import React, { useEffect, useState } from 'react';
import CounselorDoctor from './CounselorDoctor';
import PaymentConfirm from './PaymentConfirm';
import PickingDate from './PickingDate';
import TestService from './TestService';
import TimeSlots from './TimeSlots';
import { postData, fetchData } from '../LoginRegister/api_register';
import { useNavigate } from 'react-router-dom';

import './TestBooking.css';
import accountAPI from '../../services/accountAPI';

export default function TestBooking() {
    const navigate = useNavigate();

    // const [S_Service, setS_Service] = React.useState(null);
    const [testResults, setTestResults] = useState([]);
    const [testBookings, setTestBookings] = useState([]);
    const [testServiceParameters, setTestServiceParameters] = useState([]);

    const [S_Test, setS_Test] = React.useState(null);
    const [S_Doctor, setS_Doctor] = React.useState(null);
    const [S_Date, setS_Date] = React.useState(null);
    const [S_Slot, setS_Slot] = React.useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [user, setUser] = useState(null);

    // Lấy thông tin user để biết số dư ví khi component mount
  useEffect(() => {
          const fetchUserInfo = async () => {
            try {
              const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
              const userId = localStorage.getItem("UserId");
              const token = localStorage.getItem("token");
      
              const res = await fetch(`${API_URL}/accounts/${userId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const data = await res.json()
              setUser(data)
            } catch (err) {
              console.error("❌ Error fetching user info:", err);
            }
          };
      
          fetchUserInfo();
        }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchAll = async () => {
            try {
                const [TestResult, TestBooking, TestServiceParameter] = await Promise.all([
                    fetchData('/testresults', token),
                    fetchData('/testbookings', token),
                    fetchData('/testserviceparameters', token),
                ]);
                // console.log('TestResult', TestResult);
                console.log('TestResult', TestResult.filter(r => r._id === '686fe90ed13992f1533ab41d'));
                console.log('TestBooking', TestBooking);
                console.log('TestServiceParameter', TestServiceParameter);
                console.log('=============================');
                // setTestResults(TestResult.filter(r => r._id === '686fe90ed13992f1533ab41d'));
                setTestResults(TestResult);
                setTestBookings(TestBooking);
                setTestServiceParameters(TestServiceParameter);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const BookingTestFunction = async (S_Date, S_Slot) => {

        const price = S_Slot?.testServiceId?.price || 0;
    if (user.wallet === undefined || user.wallet < price) {
      alert('Wallet balance is not enough to pay.');
      navigate('/'); // hoặc trang nạp tiền
      return;
    }

        const BookingData = {
            customerId: localStorage.getItem('CustomerId'),
            doctorTestServiceId: S_Slot?._id,
            bookingDate: S_Date,
            status: 'Pending',
            note: '',
        };
        console.log('BookingData:', BookingData);

        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const resultTestBookings = await postData('/testbookings', token, BookingData);
            console.log('resultTestBookings', resultTestBookings);

            if (resultTestBookings) {
                const ResultData = {
                    testBookingId: resultTestBookings._id,
                    resultDate: new Date().toISOString(),
                    resultFile: '',
                    status: 'Pending',
                };
                console.log('ResultData:', ResultData);

                const resultTestResults = await postData('/testresults', token, ResultData);
                console.log('resultTestResults', resultTestResults);

                if (resultTestResults) {
                    const testServiceId = S_Test?._id
                    console.log('testServiceId', testServiceId);
                    const Parameter = testServiceParameters.filter(tsp => tsp.testServiceId?._id == testServiceId);
                    console.log('Parameter', Parameter);

                    for (let index = 0; index < Parameter.length; index++) {
                        const ResultDetailData = {
                            parameterId: Parameter[index]?.parameterId?._id,
                            testResultId: resultTestResults?._id,
                            value: null,
                        };
                        console.log('ResultDetailData:', ResultDetailData);

                        const resultTestResultDetails = await postData('/testresultdetails', token, ResultDetailData);
                        console.log('resultTestResultDetails', resultTestResultDetails);
                    }
                }
            }

                    // Trừ tiền trong ví sau khi booking thành công
                    const newBalance = user.wallet - price;
                    await accountAPI.updateProfile(user._id, { wallet: newBalance });
                    setUser(prev => ({ ...prev, wallet: newBalance }));

            navigate('/paymentstatus/?message=Thanh%20to%C3%A1n%20th%C3%A0nh%20c%C3%B4ng&type=tests');
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = () => {
        console.log('handleBooking');
        BookingTestFunction(
            S_Date,
            S_Slot,
        );
    }

    return (
        <div className='testbooking-container'>
            {/* {!S_Doctor && */}
            <TestService S_Test={S_Test} setS_Test={setS_Test} S_Doctor={S_Doctor} />
            {/* } */}

            {/* {S_Test && !S_Slot && */}
            <CounselorDoctor S_Test={S_Test} S_Doctor={S_Doctor} setS_Doctor={setS_Doctor} S_Slot={S_Slot} />
            {/* } */}

            {/* {S_Doctor && !S_Slot && */}
            <PickingDate S_Doctor={S_Doctor} S_Date={S_Date} setS_Date={setS_Date} S_Slot={S_Slot} />
            {/* } */}

            {/* {S_Test && S_Doctor && S_Date && */}
            <TimeSlots S_Test={S_Test} S_Doctor={S_Doctor} S_Date={S_Date} S_Slot={S_Slot} setS_Slot={setS_Slot} />
            {/* } */}

            {/* {S_Slot && */}
            <PaymentConfirm loading={loading} S_Test={S_Test} S_Doctor={S_Doctor} S_Date={S_Date} S_Slot={S_Slot} handleBooking={handleBooking} />
            {/* } */}
        </div>
    )
}
