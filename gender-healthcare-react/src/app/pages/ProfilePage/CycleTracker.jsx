"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"
import Button from "../../components/ui//Button"
import Calendar from "../../components/ui/Calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs"
import Badge from "../components/ui/Badge"

const CycleTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const cycleData = [
    { day: 1, temp: 36.5, symptoms: "Bleeding" },
    { day: 2, temp: 36.4, symptoms: "Bleeding" },
    { day: 3, temp: 36.5, symptoms: "Bleeding" },
    { day: 4, temp: 36.4, symptoms: "Spotting" },
    { day: 5, temp: 36.3, symptoms: "None" },
    { day: 12, temp: 37.0, symptoms: "Ovulation" },
    { day: 27, temp: 36.7, symptoms: "PMS" },
    { day: 28, temp: 36.6, symptoms: "PMS" },
  ]

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
                <Calendar selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
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
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Temperature chart would be displayed here</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {cycleData.map(
                  (data, index) =>
                    data.symptoms !== "None" && (
                      <Badge
                        key={index}
                        variant={
                          data.symptoms === "Bleeding"
                            ? "error"
                            : data.symptoms === "Spotting"
                              ? "warning"
                              : data.symptoms === "Ovulation"
                                ? "default"
                                : "secondary"
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
                    <Button variant="outline" size="sm">
                      <span className="mr-1">←</span>
                    </Button>
                    <Button variant="outline" size="sm">
                      <span className="mr-1">→</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((day) => (
                    <Card key={day}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">June {day}, 2025</p>
                          <p className="text-sm text-gray-500">
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
                  <span className="mr-2">+</span>
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
              <h4 className="text-sm font-medium text-gray-500">Average Cycle Length</h4>
              <p className="text-2xl font-bold">28 days</p>
              <p className="text-xs text-gray-500">Based on last 6 cycles</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">Average Period Length</h4>
              <p className="text-2xl font-bold">5 days</p>
              <p className="text-xs text-gray-500">Based on last 6 cycles</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">Cycle Regularity</h4>
              <p className="text-2xl font-bold">Regular</p>
              <p className="text-xs text-gray-500">Low variation between cycles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CycleTracker
