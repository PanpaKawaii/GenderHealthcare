import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ForumComponents/ui/card"
import { Button } from "../../components/ForumComponents/ui/button"
import { Switch } from "../../components/ForumComponents/ui/switch"
import { Bell, Calendar, Clock, Pill, Trash2, Plus } from "lucide-react"
import { Badge } from "../../components/ForumComponents/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ForumComponents/ui/dialog"
import { Input } from "../../components/ForumComponents/ui/input"
import { Label } from "../../components/ForumComponents/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ForumComponents/ui/select"

// Mock data for reminders
const initialReminders = [
  {
    id: 1,
    title: "Take Contraceptive Pill",
    time: "8:00 PM",
    days: "Daily",
    icon: "pill",
    active: true,
    type: "medication",
  },
  {
    id: 2,
    title: "Log Symptoms",
    time: "9:00 PM",
    days: "Daily",
    icon: "calendar",
    active: true,
    type: "tracking",
  },
  {
    id: 3,
    title: "Gynecologist Appointment",
    time: "10:00 AM",
    days: "June 12, 2025",
    icon: "calendar",
    active: true,
    type: "appointment",
  },
  {
    id: 4,
    title: "STI Test Results",
    time: "2:00 PM",
    days: "June 15, 2025",
    icon: "calendar",
    active: true,
    type: "test",
  },
  {
    id: 5,
    title: "Refill Prescription",
    time: "Any time",
    days: "June 20, 2025",
    icon: "pill",
    active: true,
    type: "medication",
  },
]

export default function RemindersList() {
  const [reminders, setReminders] = useState(initialReminders)
  const [open, setOpen] = useState(false)

  const toggleReminder = (id) => {
    setReminders(
      reminders.map((reminder) => (reminder.id === id ? { ...reminder, active: !reminder.active } : reminder)),
    )
  }

  const deleteReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id))
  }

  const getIcon = (icon) => {
    switch (icon) {
      case "pill":
        return <Pill className="h-5 w-5" />
      case "calendar":
        return <Calendar className="h-5 w-5" />
      case "clock":
        return <Clock className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getBadgeStyle = (type) => {
    switch (type) {
      case "medication":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "tracking":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "appointment":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "test":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Reminders</CardTitle>
            <CardDescription>Manage your health reminders</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Reminder</DialogTitle>
                <DialogDescription>Set up a new reminder for your health needs</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Take medication" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="tracking">Tracking</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="test">Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select>
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="once">One time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Save Reminder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      reminder.type === "medication"
                        ? "bg-blue-100"
                        : reminder.type === "tracking"
                          ? "bg-green-100"
                          : reminder.type === "appointment"
                            ? "bg-purple-100"
                            : "bg-amber-100"
                    }`}
                  >
                    {getIcon(reminder.icon)}
                  </div>
                  <div>
                    <h4 className="font-medium">{reminder.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{reminder.time}</span>
                      <span>•</span>
                      <span>{reminder.days}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getBadgeStyle(reminder.type)}>
                    {reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}
                  </Badge>
                  <Switch checked={reminder.active} onCheckedChange={() => toggleReminder(reminder.id)} />
                  <Button variant="ghost" size="icon" onClick={() => deleteReminder(reminder.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Customize how you receive reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive reminders via email</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">SMS Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive reminders via text message</p>
            </div>
            <Switch />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
