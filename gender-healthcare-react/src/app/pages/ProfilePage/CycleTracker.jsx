import { Badge } from "../../components/ForumComponents/ui/badge"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ForumComponents/ui/card"
import { Button } from "../../components/ForumComponents/ui/button"
import { Calendar } from "../../components/ForumComponents/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ForumComponents/ui/tabs"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { CycleChart } from "./cycle-chart"

// Mock data for the cycle chart
const cycleData = [
  { day: 1, temp: 36.5, symptoms: "Bleeding" },
  { day: 2, temp: 36.4, symptoms: "Bleeding" },
  { day: 3, temp: 36.5, symptoms: "Bleeding" },
  { day: 4, temp: 36.4, symptoms: "Spotting" },
  { day: 5, temp: 36.3, symptoms: "None" },
  { day: 6, temp: 36.4, symptoms: "None" },
  { day: 7, temp: 36.5, symptoms: "None" },
  { day: 8, temp: 36.6, symptoms: "None" },
  { day: 9, temp: 36.7, symptoms: "None" },
  { day: 10, temp: 36.8, symptoms: "None" },
  { day: 11, temp: 36.9, symptoms: "None" },
  { day: 12, temp: 37.0, symptoms: "Ovulation" },
  { day: 13, temp: 37.1, symptoms: "None" },
  { day: 14, temp: 37.0, symptoms: "None" },
  { day: 15, temp: 36.9, symptoms: "None" },
  { day: 16, temp: 36.8, symptoms: "None" },
  { day: 17, temp: 36.7, symptoms: "None" },
  { day: 18, temp: 36.6, symptoms: "None" },
  { day: 19, temp: 36.7, symptoms: "None" },
  { day: 20, temp: 36.8, symptoms: "None" },
  { day: 21, temp: 36.7, symptoms: "None" },
  { day: 22, temp: 36.6, symptoms: "None" },
  { day: 23, temp: 36.5, symptoms: "None" },
  { day: 24, temp: 36.6, symptoms: "None" },
  { day: 25, temp: 36.7, symptoms: "None" },
  { day: 26, temp: 36.8, symptoms: "None" },
  { day: 27, temp: 36.7, symptoms: "PMS" },
  { day: 28, temp: 36.6, symptoms: "PMS" },
]

export default function CycleTracker() {
  const [date, setDate] = useState(new Date())

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cycle Tracker</CardTitle>
          <CardDescription>Track and predict your menstrual cycle</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calendar">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="log">Log</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  className="rounded-md border"
                  modifiers={{
                    period: (date) => {
                      const day = date.getDate()
                      return day >= 1 && day <= 5
                    },
                    fertile: (date) => {
                      const day = date.getDate()
                      return day >= 10 && day <= 14
                    },
                    ovulation: (date) => {
                      const day = date.getDate()
                      return day === 12
                    },
                    pms: (date) => {
                      const day = date.getDate()
                      return day >= 27 && day <= 28
                    },
                  }}
                  modifiersClassNames={{
                    period: "bg-red-100 text-red-800 hover:bg-red-200",
                    fertile: "bg-pink-100 text-pink-800 hover:bg-pink-200",
                    ovulation: "bg-purple-100 text-purple-800 hover:bg-purple-200",
                    pms: "bg-amber-100 text-amber-800 hover:bg-amber-200",
                  }}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-sm">Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                  <span className="text-sm">Fertile Window</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span className="text-sm">Ovulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="text-sm">PMS</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chart">
              <CycleChart data={cycleData} />

              <div className="mt-4 flex flex-wrap gap-2">
                {cycleData.map(
                  (data, index) =>
                    data.symptoms !== "None" && (
                      <Badge
                        key={index}
                        variant="outline"
                        className={
                          data.symptoms === "Bleeding"
                            ? "bg-red-100 text-red-800"
                            : data.symptoms === "Spotting"
                              ? "bg-orange-100 text-orange-800"
                              : data.symptoms === "Ovulation"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-amber-100 text-amber-800"
                        }
                      >
                        Day {data.day}: {data.symptoms}
                      </Badge>
                    ),
                )}
              </div>
            </TabsContent>

            <TabsContent value="log">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">June 2025</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((day) => (
                    <Card key={day}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">June {day}, 2025</p>
                          <p className="text-sm text-muted-foreground">
                            {day <= 3 ? "Heavy flow" : day === 4 ? "Medium flow" : "Light flow"}
                          </p>
                          {day === 2 && <p className="text-sm text-red-600">Cramps, Headache</p>}
                          {day === 3 && <p className="text-sm text-red-600">Cramps</p>}
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Log New Entry
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cycle Insights</CardTitle>
          <CardDescription>Based on your tracked data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Average Cycle Length</h4>
              <p className="text-2xl font-bold">28 days</p>
              <p className="text-xs text-muted-foreground">Based on last 6 cycles</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Average Period Length</h4>
              <p className="text-2xl font-bold">5 days</p>
              <p className="text-xs text-muted-foreground">Based on last 6 cycles</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Cycle Regularity</h4>
              <p className="text-2xl font-bold">Regular</p>
              <p className="text-xs text-muted-foreground">Low variation between cycles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
