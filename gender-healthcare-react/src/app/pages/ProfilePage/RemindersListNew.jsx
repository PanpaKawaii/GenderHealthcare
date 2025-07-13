import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ForumComponents/ui/card"
import { Button } from "../../components/ForumComponents/ui/button"
// import { Switch } from "../../components/ForumComponents/ui/switch"
import { Bell, Calendar, Clock, Pill, Trash2, Plus, Loader2 } from "lucide-react"
import { Badge } from "../../components/ForumComponents/ui/badge"
import dayjs from "dayjs"
import { reminderAPI } from "../../services/healthAPI"

export default function RemindersListNew() {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const customerId = localStorage.getItem("UserId")

  useEffect(() => {
    const fetchReminders = async () => {
      if (!customerId) return
      
      setLoading(true)
      try {
        const response = await reminderAPI.getByCustomer(customerId)
        console.log("Fetched reminders:", response.data)
        setReminders(response.data)
      } catch (err) {
        console.error("Error fetching reminders:", err)
        setError("Failed to load reminder data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchReminders()
  }, [customerId])

  const getIcon = (type) => {
    switch (type) {
      case "medication":
        return <Pill className="h-5 w-5" />
      case "appointment":
        return <Calendar className="h-5 w-5" />
      case "test":
        return <Calendar className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getBadgeStyle = (type) => {
    switch (type) {
      case "medication":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "appointment":
        return "bg-green-100 text-green-800 border-green-200"
      case "test":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Reminders</CardTitle>
            <CardDescription>Set reminders for medications and appointments</CardDescription>
          </div>
          {/* <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1" />
            Add Reminder
          </Button> */}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : reminders.length > 0 ? (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder._id}
                  className="flex flex-col p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getBadgeStyle(reminder.type)}`}>
                        {getIcon(reminder.type)}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{reminder.title}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {reminder.time} • 
                          <Calendar className="h-3 w-3 ml-1" /> {reminder.recurrence || dayjs(reminder.date).format('MMM DD, YYYY')}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${getBadgeStyle(reminder.type)} px-3 py-1 rounded-full`}>
                      {reminder.type}
                    </Badge>
                  </div>
                  
                  {reminder.message && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                      <p className="text-gray-700">
                        {reminder.message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No reminders set yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
