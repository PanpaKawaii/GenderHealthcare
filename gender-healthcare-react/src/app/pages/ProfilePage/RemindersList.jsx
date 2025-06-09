"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Badge from "../../components/ui/Badge"
import Modal from "../../components/ui/Modal"
import Input from "../../components/ui/Input"
import Label from "../../components/ui/Label"
import Select, { SelectItem } from "../../components/ui/Select"

const RemindersList = () => {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Take Contraceptive Pill",
      time: "8:00 PM",
      days: "Daily",
      icon: "💊",
      active: true,
      type: "medication",
    },
    {
      id: 2,
      title: "Log Symptoms",
      time: "9:00 PM",
      days: "Daily",
      icon: "📝",
      active: true,
      type: "tracking",
    },
    {
      id: 3,
      title: "Gynecologist Appointment",
      time: "10:00 AM",
      days: "June 12, 2025",
      icon: "👩‍⚕️",
      active: true,
      type: "appointment",
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleReminder = (id) => {
    setReminders(
      reminders.map((reminder) => (reminder.id === id ? { ...reminder, active: !reminder.active } : reminder)),
    )
  }

  const deleteReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id))
  }

  const getBadgeVariant = (type) => {
    switch (type) {
      case "medication":
        return "default"
      case "tracking":
        return "success"
      case "appointment":
        return "secondary"
      default:
        return "outline"
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
          <Button onClick={() => setIsModalOpen(true)}>
            <span className="mr-2">+</span>
            Add Reminder
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{reminder.icon}</div>
                  <div>
                    <h4 className="font-medium">{reminder.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>🕐</span>
                      <span>{reminder.time}</span>
                      <span>•</span>
                      <span>{reminder.days}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getBadgeVariant(reminder.type)}>
                    {reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}
                  </Badge>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reminder.active}
                      onChange={() => toggleReminder(reminder.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-11 h-6 rounded-full transition-colors ${reminder.active ? "bg-teal-600" : "bg-gray-300"}`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${reminder.active ? "translate-x-5" : "translate-x-0.5"} mt-0.5`}
                      ></div>
                    </div>
                  </label>
                  <Button variant="ghost" size="sm" onClick={() => deleteReminder(reminder.id)}>
                    🗑️
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
              <p className="text-sm text-gray-500">Receive notifications on your device</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only" />
              <div className="w-11 h-6 bg-teal-600 rounded-full">
                <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-5 mt-0.5"></div>
              </div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive reminders via email</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" />
              <div className="w-11 h-6 bg-gray-300 rounded-full">
                <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-0.5 mt-0.5"></div>
              </div>
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Save Preferences
          </Button>
        </CardFooter>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Reminder"
        description="Set up a new reminder for your health needs"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Take medication" />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select placeholder="Select type">
              <SelectItem value="medication">Medication</SelectItem>
              <SelectItem value="tracking">Tracking</SelectItem>
              <SelectItem value="appointment">Appointment</SelectItem>
              <SelectItem value="test">Test</SelectItem>
            </Select>
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" />
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)} className="flex-1">
              Save Reminder
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default RemindersList
