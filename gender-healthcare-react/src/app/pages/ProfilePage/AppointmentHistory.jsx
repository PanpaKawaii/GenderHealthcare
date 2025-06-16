import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ForumComponents/ui/card"
import { Button } from "../../components/ForumComponents/ui/button"
import { Badge } from "../../components/ForumComponents/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ForumComponents/ui/tabs"
import { Calendar } from "../../components/ForumComponents/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ForumComponents/ui/dialog"
import { Label } from "../../components/ForumComponents/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ForumComponents/ui/select"
import { Textarea } from "../../components/ForumComponents/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ForumComponents/ui/avatar"
import { CalendarIcon, Clock, MessageSquare, Plus, Video } from "lucide-react"

// Mock data for appointments
const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Smith",
    specialty: "Gynecologist",
    date: "June 12, 2025",
    time: "10:00 AM",
    type: "In-person",
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "Sexual Health Counselor",
    date: "June 18, 2025",
    time: "2:30 PM",
    type: "Video",
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const pastAppointments = [
  {
    id: 3,
    doctor: "Dr. Sarah Smith",
    specialty: "Gynecologist",
    date: "May 15, 2025",
    time: "11:00 AM",
    type: "In-person",
    status: "completed",
    notes: "Annual checkup. Everything looks normal. Follow up in 12 months.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    doctor: "Dr. James Wilson",
    specialty: "Reproductive Specialist",
    date: "April 22, 2025",
    time: "9:30 AM",
    type: "In-person",
    status: "completed",
    notes: "Discussed fertility options. Recommended tracking cycle for 3 months.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    doctor: "Dr. Michael Chen",
    specialty: "Sexual Health Counselor",
    date: "March 10, 2025",
    time: "3:00 PM",
    type: "Video",
    status: "completed",
    notes: "Initial consultation. Discussed concerns about contraception options.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function AppointmentHistory() {
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pending</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Manage your healthcare appointments</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
                <DialogDescription>Schedule a consultation with one of our healthcare providers</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="doctor">Provider</Label>
                  <Select>
                    <SelectTrigger id="doctor">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-smith">Dr. Sarah Smith (Gynecologist)</SelectItem>
                      <SelectItem value="dr-chen">Dr. Michael Chen (Sexual Health Counselor)</SelectItem>
                      <SelectItem value="dr-wilson">Dr. James Wilson (Reproductive Specialist)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-person">In-person</SelectItem>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) => {
                      const today = new Date()
                      return date < today || date > new Date(today.setMonth(today.getMonth() + 3))
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Select>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea id="reason" placeholder="Briefly describe your reason for this appointment" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Book Appointment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.doctor} />
                          <AvatarFallback>
                            {appointment.doctor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{appointment.doctor}</h4>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {appointment.type === "Video" ? (
                                <Video className="h-3 w-3" />
                              ) : (
                                <span className="h-3 w-3">🏥</span>
                              )}
                              <span>{appointment.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {appointment.type === "Video" && (
                            <Button variant="outline" size="sm">
                              <Video className="mr-2 h-4 w-4" />
                              Join
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming appointments</p>
                  <Button variant="outline" className="mt-4" onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.doctor} />
                        <AvatarFallback>
                          {appointment.doctor
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{appointment.doctor}</h4>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {appointment.type === "Video" ? (
                              <Video className="h-3 w-3" />
                            ) : (
                              <span className="h-3 w-3">🏥</span>
                            )}
                            <span>{appointment.type}</span>
                          </div>
                        </div>
                        {appointment.notes && (
                          <div className="mt-2 p-2 bg-muted rounded-md text-sm">
                            <p className="font-medium">Notes:</p>
                            <p>{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        Book Follow-up
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
