import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ForumComponents/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ForumComponents/ui/card"
import { Button } from "../../components/ForumComponents/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ForumComponents/ui/avatar"
import { Badge } from "../../components/ForumComponents/ui/badge"
import { CalendarIcon, Settings as SettingsIcon, Bell, Calendar, Activity, User } from "lucide-react"
import { Progress } from "../../components/ForumComponents/ui/progress"
import CycleTrackerNew from "./CycleTrackerNew"
import RemindersListNew from "./RemindersListNew"
import SettingsComponent from "./Settings"
import AppointmentHistory from "./AppointmentHistory"
import TestResults from "./TestResult"
import EditProfileDialog from "./EditProfileDialog"
import { format } from "date-fns"

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const UserId = localStorage.getItem('UserId');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!UserId) return;
      
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
        // Fetch user account info
        const accountResponse = await fetch(`${API_URL}/accounts/${UserId}`);
        if (accountResponse.ok) {
          const accountData = await accountResponse.json();
          setUserInfo(accountData);
          
          // Fetch customer details if user is a customer
          if (accountData.role === 'Customer') {
            const customerResponse = await fetch(`${API_URL}/customers?accountId=${UserId}`);
            if (customerResponse.ok) {
              const customerData = await customerResponse.json();
              if (customerData && customerData.length > 0) {
                setCustomerInfo(customerData[0]);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [UserId]);

  // Function to refresh user data after profile update
  const refreshUserData = async () => {
    if (!UserId) return;
    
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      // Fetch user account info
      const accountResponse = await fetch(`${API_URL}/accounts/${UserId}`);
      if (accountResponse.ok) {
        const accountData = await accountResponse.json();
        setUserInfo(accountData);
        
        // Fetch customer details if user is a customer
        if (accountData.role === 'Customer') {
          const customerResponse = await fetch(`${API_URL}/customers?accountId=${UserId}`);
          if (customerResponse.ok) {
            const customerData = await customerResponse.json();
            if (customerData && customerData.length > 0) {
              setCustomerInfo(customerData[0]);
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-20 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
      <p className="mt-4 text-gray-600"> Loading user profile...</p>
    </div>;
  }

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getJoinDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMMM yyyy");
  };

  return (
    <div className="max-w-3/4 mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Profile Header */}
        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-teal-500">
                <AvatarImage src={userInfo?.image || "/avatar.jpg"} alt="Profile" />
                <AvatarFallback>{getInitials(userInfo?.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{userInfo?.name || "User"}</CardTitle>
                <CardDescription>Thành viên từ {getJoinDate(userInfo?.createdAt)}</CardDescription>
                <div className="flex gap-2 mt-2">
                  {userInfo?.isVerified && (
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 hover:bg-teal-100">
                      Verified
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {userInfo?.role || "Customer"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="font-medium">{userInfo?.email || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground"> Gender </span>
                <span className="font-medium">{userInfo?.gender || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Date of Birth</span>
                <span className="font-medium">{customerInfo?.dateOfBirth ? 
                  format(new Date(customerInfo.dateOfBirth), "dd/MM/yyyy") : "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Phone Number</span>
                <span className="font-medium">{userInfo?.phone || "N/A"}</span>
              </div>
              {customerInfo?.address && (
                <div className="flex flex-col col-span-2">
                  <span className="text-sm text-muted-foreground">Address </span>
                  <span className="font-medium">{customerInfo.address}</span>
                </div>
              )}
            </div>

            {/* <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Hoàn thành hồ sơ</h4>
              <Progress value={userInfo?.image ? 100 : 80} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {userInfo?.image ? "Hồ sơ đã hoàn tất" : "Cập nhật ảnh đại diện để hoàn tất hồ sơ"}
              </p>
            </div> */}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setIsEditProfileOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardFooter>
        </Card>

        {/* Main Content Area */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Quick Stats */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Calendar className="h-8 w-8 text-teal-500 mb-2" />
                <p className="text-sm font-medium">Next Period</p>
                <p className="text-lg font-bold">Jun 15</p>
                <p className="text-xs text-muted-foreground">In 7 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Activity className="h-8 w-8 text-pink-500 mb-2" />
                <p className="text-sm font-medium">Fertility Window</p>
                <p className="text-lg font-bold">Jun 10-14</p>
                <p className="text-xs text-muted-foreground">High chance</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <CalendarIcon className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-sm font-medium">Next Appointment</p>
                <p className="text-lg font-bold">Jun 12</p>
                <p className="text-xs text-muted-foreground">Dr. Smith</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Bell className="h-8 w-8 text-amber-500 mb-2" />
                <p className="text-sm font-medium">Pill Reminder</p>
                <p className="text-lg font-bold">Daily</p>
                <p className="text-xs text-muted-foreground">8:00 PM</p>
              </CardContent>
            </Card>
          </div> */}

          {/* Tabs for different sections */}
          <Tabs defaultValue="cycle" className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="cycle">Cycle</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="tests">Tests</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="cycle" className="space-y-4">
              <CycleTrackerNew />
            </TabsContent>

            <TabsContent value="reminders" className="space-y-4">
              <RemindersListNew />
            </TabsContent>

            <TabsContent value="appointments" className="space-y-4">
              <AppointmentHistory />
            </TabsContent>

            <TabsContent value="tests" className="space-y-4">
              <TestResults />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <SettingsComponent />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      {isEditProfileOpen && (
        <EditProfileDialog 
          isOpen={isEditProfileOpen} 
          onClose={() => setIsEditProfileOpen(false)} 
          userInfo={userInfo} 
          customerInfo={customerInfo}
          onProfileUpdated={refreshUserData}
        />
      )}
    </div>
  )
}
