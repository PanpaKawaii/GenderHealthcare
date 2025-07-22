import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ForumComponents/ui/card"
import { Button } from "../../components/ForumComponents/ui/button"
import { Badge } from "../../components/ForumComponents/ui/badge"
import { Loader2, FileText, Calendar, X } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
  DialogPortal,
  DialogOverlay
} from "../../components/ForumComponents/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ForumComponents/ui/table"
import { testbookingAPI, testresultAPI, testresultdetailAPI } from "../../services/api"
import { format } from "date-fns"
import accountAPI from "../../services/accountAPI"

export default function TestResults() {
  const [testBookings, setTestBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTestResult, setSelectedTestResult] = useState(null)
  const [testResultDetails, setTestResultDetails] = useState([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const customerId = localStorage.getItem("UserId")
  const [user, setUser] = useState (null)
  
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
    const fetchTestBookings = async () => {
      if (!customerId) return
      
      setLoading(true)
      try {
        const response = await testbookingAPI.getAll();
        console.log("Fetched Test Bookings:", response.data)
        // Filter bookings for the current customer
        const customerBookings = response.data.filter(
          booking => booking.customerId?.accountId === customerId
        );
        console.log("Customer Bookings:")
        setTestBookings(customerBookings);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching test bookings:", err)
        setError("Failed to load test booking data")
        setLoading(false)
      }
    }
    
    fetchTestBookings()
  }, [customerId])

  // Xử lý hoàn tiền
  const handleRefund = async (booking) => {
  if (!user) {
    alert("User data not loaded, please try again later.");
    return;
  }

  if (booking.isRefund) {
    alert("This booking has already been refunded.");
    return;
  }

  const price = booking.doctorTestServiceId?.testServiceId?.price || 0;
  if (price <= 0) {
    alert("This booking has no refundable amount.");
    return;
  }

  try {
    // Gọi API refund, backend xử lý hoàn tiền
    await testbookingAPI.refund(booking._id);

    // Lấy lại danh sách booking để cập nhật
    const response = await testbookingAPI.getAll();
    const customerBookings = response.data.filter((b) => b.customerId?.accountId === customerId);
    setTestBookings(customerBookings);

    // Lấy lại thông tin ví user sau refund (backend đã update)
    const userResponse = await accountAPI.getProfile(user._id);  // hoặc getProfile(), tùy API bạn có
    setUser(userResponse.data);

    alert(`Refunded ${price} VND to your wallet for booking #${booking._id}`);
  } catch (err) {
    console.error("Refund failed:", err);
    alert("Failed to process refund, please try again later.");
  }
};


  const handleViewDetails = async (testBookingId) => {
    setDetailsLoading(true)
    setIsDialogOpen(true)
    
    try {
      // First, fetch the test result for this booking
      const resultResponse = await testresultAPI.getAll()
      const testResult = resultResponse.data.find(
        result => result.testBookingId._id === testBookingId
      )
      
      if (testResult) {
        setSelectedTestResult(testResult)
        
        // Then fetch the test result details
        const detailsResponse = await testresultdetailAPI.getAll()
        const filteredDetails = detailsResponse.data.filter(
          detail => detail.testResultId._id === testResult._id
        )
        
        setTestResultDetails(filteredDetails)
      } else {
        setSelectedTestResult(null)
        setTestResultDetails([])
      }
    } catch (err) {
      console.error("Error fetching test result details:", err)
      setSelectedTestResult(null)
      setTestResultDetails([])
    } finally {
      setDetailsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'finished':
        return 'bg-green-100 text-green-800'
      case 'occurring':
        return 'bg-blue-100 text-blue-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white">
        <CardHeader className="bg-white">
          <CardTitle>Test Results</CardTitle>
          <CardDescription>View your medical test bookings and results</CardDescription>
        </CardHeader>
        <CardContent className="bg-white">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : testBookings.length > 0 ? (
            <div className="space-y-4">
              {testBookings.map((booking) => {
                const statusLower = (booking.status || "").toLowerCase();
                const isCancelled = statusLower === "canceled" || statusLower === "cancelled";
                const hasBeenRefunded = booking.isRefund;
                return (
                <div key={booking._id} className="p-4 border rounded-lg bg-white hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">
                          {booking.doctorTestServiceId?.testServiceId?.name || "Test Service"}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        {booking.doctorTestServiceId?.doctorId?.medicalFacilityId?.name || "Medical Facility"}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{formatDate(booking.bookingDate)}</span>
                      </div>
                      
                      <p className="text-sm mt-2">
                        {booking.note || "No additional notes"}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(booking._id)}>
                        <FileText className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                       {isCancelled && !hasBeenRefunded && (
                          <Button size="sm" variant="destructive" onClick={() => handleRefund(booking)}>
                            Refund
                          </Button>
                        )}
                        {hasBeenRefunded && (
                          <span className="ml-2 text-green-600 text-sm font-semibold">Refunded</span>
                        )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No test bookings available
            </div>
          )}
        </CardContent>
      </Card>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-50 bg-gray-600/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogContent className="fixed z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg p-6 shadow-lg max-w-[900px]  overflow-y-auto focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <DialogTitle className="text-lg font-semibold">
              Test Result Details
            </DialogTitle>
            <DialogDescription className="mb-4 text-sm text-gray-600">
              {selectedTestResult ? (
                <div className="space-y-1">
                  <p>Test Date: {formatDate(selectedTestResult.resultDate)}</p>
                  <p>
                    Status:{" "}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(
                        selectedTestResult.status
                      )}`}
                    >
                      {selectedTestResult.status}
                    </span>
                  </p>
                </div>
              ) : (
                <p>No test result information available</p>
              )}
            </DialogDescription>

            {detailsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : testResultDetails.length > 0 ? (
              <Table className="bg-white">
                <TableHeader className="bg-white">
                  <TableRow className="bg-white">
                    <TableHead>Parameter</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Reference Range</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {testResultDetails.map((detail) => {
                    const value = detail.value;
                    const min = detail.parameterId?.referenceMin;
                    const max = detail.parameterId?.referenceMax;
                    let status = "Normal";
                    let statusColor = "text-green-600";

                    if (value !== null) {
                      if (value < min) {
                        status = "Low";
                        statusColor = "text-yellow-600";
                      } else if (value > max) {
                        status = "High";
                        statusColor = "text-red-600";
                      }
                    } else {
                      status = "Pending";
                      statusColor = "text-gray-600";
                    }

                    return (
                      <TableRow key={detail._id} className="bg-white hover:bg-gray-50">
                        <TableCell>{detail.parameterId?.name}</TableCell>
                        <TableCell>{value !== null ? value : "Pending"}</TableCell>
                        <TableCell>{detail.parameterId?.unit}</TableCell>
                        <TableCell>{`${min} - ${max}`}</TableCell>
                        <TableCell className={statusColor}>{status}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No test result details available
              </div>
            )}
            
            <DialogClose asChild>
              <button className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100" aria-label="Close">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  )
}
