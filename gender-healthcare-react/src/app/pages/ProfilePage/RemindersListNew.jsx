import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ForumComponents/ui/card"
import { Button } from "../../components/ForumComponents/ui/button"
import { Switch } from "../../components/ForumComponents/ui/switch"
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
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "appointment":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "test":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
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
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1" />
            Add Reminder
          </Button>
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
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      {getIcon(reminder.type)}
                    </div>
                    <div>
                      <div className="font-medium">{reminder.title}</div>
                      <div className="text-sm text-gray-500">
                        {reminder.time} • {reminder.recurrence || dayjs(reminder.date).format('MMM DD, YYYY')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getBadgeStyle(reminder.type)}>
                      {reminder.type}
                    </Badge>
                    <Switch 
                      id={`reminder-${reminder._id}`} 
                      checked={reminder.isActive} 
                      onCheckedChange={async (checked) => {
                        try {
                          await reminderAPI.toggleActive(reminder._id, checked);
                          setReminders(reminders.map(r => 
                            r._id === reminder._id ? {...r, isActive: checked} : r
                          ));
                        } catch (err) {
                          console.error("Failed to toggle reminder:", err);
                        }
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500"
                      onClick={async () => {
                        try {
                          await reminderAPI.delete(reminder._id);
                          setReminders(reminders.filter(r => r._id !== reminder._id));
                        } catch (err) {
                          console.error("Failed to delete reminder:", err);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
