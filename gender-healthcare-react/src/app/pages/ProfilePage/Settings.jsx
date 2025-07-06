import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ForumComponents/ui/card"
import { Button } from "../../components/ForumComponents/ui/button"
import { Switch } from "../../components/ForumComponents/ui/switch"
import { Label } from "../../components/ForumComponents/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ForumComponents/ui/select"
import { Bell, ShieldCheck, Moon, Eye } from "lucide-react"

export default function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [theme, setTheme] = useState("light")
  const [privacy, setPrivacy] = useState("friends")
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your application preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="notification-period" className="flex flex-col">
                  <span>Period reminders</span>
                  <span className="text-sm font-normal text-gray-500">Get notified before your period starts</span>
                </Label>
                <Switch id="notification-period" checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notification-fertility" className="flex flex-col">
                  <span>Fertility window</span>
                  <span className="text-sm font-normal text-gray-500">Get notified about your fertility window</span>
                </Label>
                <Switch id="notification-fertility" checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notification-medication" className="flex flex-col">
                  <span>Medication reminders</span>
                  <span className="text-sm font-normal text-gray-500">Get reminded to take your medication</span>
                </Label>
                <Switch id="notification-medication" checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Moon className="h-4 w-4 text-primary" />
              Appearance
            </h3>
            <div>
              <Label htmlFor="theme" className="mb-2 block">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme" className="w-full sm:w-[240px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Privacy
            </h3>
            <div>
              <Label htmlFor="privacy" className="mb-2 block">Profile visibility</Label>
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger id="privacy" className="w-full sm:w-[240px]">
                  <SelectValue placeholder="Select privacy level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button className="mt-4">Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}
