import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"
import { Badge } from "../components/ui/Badge"  // Sửa đường dẫn này
import { Progress } from "../components/ui/progress"
// import CycleTracker from "./CycleTracker"
// import RemindersList from "./RemindersList"
// import AppointmentHistory from "./AppointmentHistory"
// import TestResults from "./TestResults"
const ProfilePage = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Profile Header */}
        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">Jane Doe</h2>
                <p className="text-gray-600">Member since October 2023</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="success">Verified</Badge>
                  <Badge>Complete Profile</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Age</span>
                <span className="font-medium">28</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Blood Type</span>
                <span className="font-medium">A+</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Height</span>
                <span className="font-medium">165 cm</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Weight</span>
                <span className="font-medium">58 kg</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Profile Completion</h4>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">85% complete - Update your medical history</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <span className="mr-2">⚙️</span>
              Edit Profile
            </Button>
          </CardFooter>
        </Card>

        {/* Main Content Area */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-2xl mb-2">📅</div>
                <p className="text-sm font-medium">Next Period</p>
                <p className="text-lg font-bold">Jun 15</p>
                <p className="text-xs text-gray-500">In 7 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm font-medium">Fertility Window</p>
                <p className="text-lg font-bold">Jun 10-14</p>
                <p className="text-xs text-gray-500">High chance</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-2xl mb-2">👩‍⚕️</div>
                <p className="text-sm font-medium">Next Appointment</p>
                <p className="text-lg font-bold">Jun 12</p>
                <p className="text-xs text-gray-500">Dr. Smith</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-2xl mb-2">💊</div>
                <p className="text-sm font-medium">Pill Reminder</p>
                <p className="text-lg font-bold">Daily</p>
                <p className="text-xs text-gray-500">8:00 PM</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="cycle" className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="cycle">Cycle</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="tests">Test Results</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* <TabsContent value="cycle" className="space-y-4">
              <CycleTracker />
            </TabsContent> */}

            {/* <TabsContent value="reminders" className="space-y-4">
              <RemindersList />
            </TabsContent> */}

            {/* <TabsContent value="appointments" className="space-y-4">
              <AppointmentHistory />
            </TabsContent> */}

            {/* <TabsContent value="tests" className="space-y-4">
              <TestResults />
            </TabsContent> */}

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your account settings and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Settings content will go here...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
