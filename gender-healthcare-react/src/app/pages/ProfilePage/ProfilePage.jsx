import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ForumComponents/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ForumComponents/ui/card"
import { Button } from "../../components/ForumComponents/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ForumComponents/ui/avatar"
import { Badge } from "../../components/ForumComponents/ui/badge"
import { CalendarIcon, Settings, Bell, Calendar, Activity } from "lucide-react"
import { Progress } from "../../components/ForumComponents/ui/progress"
import CycleTracker from "./CycleTracker"
import RemindersList from "./RemindersList"
import AppointmentHistory from "./AppointmentHistory"
import TestResults from "./TestResult"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
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
                <CardTitle className="text-2xl">Jane Doe</CardTitle>
                <CardDescription>Member since October 2023</CardDescription>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="bg-teal-50 text-teal-700 hover:bg-teal-100">
                    Verified
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    Complete Profile
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Age</span>
                <span className="font-medium">28</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Blood Type</span>
                <span className="font-medium">A+</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Height</span>
                <span className="font-medium">165 cm</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Weight</span>
                <span className="font-medium">58 kg</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Profile Completion</h4>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">85% complete - Update your medical history</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Settings className="mr-2 h-4 w-4" />
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

            <TabsContent value="cycle" className="space-y-4">
              <CycleTracker />
            </TabsContent>

            <TabsContent value="reminders" className="space-y-4">
              <RemindersList />
            </TabsContent>

            <TabsContent value="appointments" className="space-y-4">
              <AppointmentHistory />
            </TabsContent>

            <TabsContent value="tests" className="space-y-4">
              <TestResults />
            </TabsContent>

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
