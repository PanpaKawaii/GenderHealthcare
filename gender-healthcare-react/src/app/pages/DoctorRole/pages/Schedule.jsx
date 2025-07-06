import React from 'react';
import { DatePicker } from 'antd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ForumComponents/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ForumComponents/ui/tabs"
import { DashboardHeader } from "../../../components/ForumComponents/ui/dashboard-header.tsx"
import { DashboardShell } from "../../../components/ForumComponents/ui/dashboard-shell.tsx"
import { Button } from "../../../components/ForumComponents/ui/button"
import { CalendarPlus } from "lucide-react"

export default function Schedule() {
  return (
    <div>
      {/* <DatePicker /> */}
      <DashboardShell>
      <DashboardHeader heading="Schedule" text="Manage your appointments and availability">
        <Button>
          <CalendarPlus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </DashboardHeader>
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>View and manage your appointments in a calendar format</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {/* <ScheduleCalendar /> */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>A list of all your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Appointment list would go here */}
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">John Smith</p>
                      <p className="text-sm text-muted-foreground">Initial Consultation</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Today, 2:00 PM</p>
                      <p className="text-sm text-muted-foreground">60 minutes</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Follow-up Session</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Today, 4:00 PM</p>
                      <p className="text-sm text-muted-foreground">45 minutes</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Michael Brown</p>
                      <p className="text-sm text-muted-foreground">Weekly Session</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Tomorrow, 10:00 AM</p>
                      <p className="text-sm text-muted-foreground">60 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Set Your Availability</CardTitle>
              <CardDescription>Configure your working hours and breaks</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Availability settings would go here */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="mb-2 font-medium">Monday</h3>
                    <div className="flex items-center space-x-2">
                      <div className="rounded-md border px-3 py-2 text-sm">9:00 AM</div>
                      <span>to</span>
                      <div className="rounded-md border px-3 py-2 text-sm">5:00 PM</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 font-medium">Tuesday</h3>
                    <div className="flex items-center space-x-2">
                      <div className="rounded-md border px-3 py-2 text-sm">9:00 AM</div>
                      <span>to</span>
                      <div className="rounded-md border px-3 py-2 text-sm">5:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
    </div>
  );
}
