import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ForumComponents/ui/card"
import { Loader2, CalendarIcon, ClockIcon } from "lucide-react"
import { Badge } from "../../components/ForumComponents/ui/badge"
import dayjs from "dayjs"
import { cycleAPI } from "../../services/healthAPI"

export default function CycleTrackerNew() {
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const customerId = localStorage.getItem("UserId")

  useEffect(() => {
    const fetchCycles = async () => {
      if (!customerId) return
      
      setLoading(true)
      try {
        const response = await cycleAPI.getByCustomer(customerId)
        setCycles(response.data)
      } catch (err) {
        console.error("Error fetching cycles:", err)
        setError("Failed to load cycle data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchCycles()
  }, [customerId])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cycle Tracker</CardTitle>
          <CardDescription>Track and predict your menstrual cycle</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {cycles.length > 0 && cycles[0].periodDays && cycles[0].periodDays.length > 0 && (
                  <>
                    <Card className="bg-pink-50">
                      <CardContent className="p-4 flex items-center space-x-4">
                        <CalendarIcon className="h-10 w-10 text-pink-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Last Period</p>
                          <p className="text-lg font-bold">{dayjs(cycles[0].periodDays[0]).format('MMM DD, YYYY')}</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-purple-50">
                      <CardContent className="p-4 flex items-center space-x-4">
                        <ClockIcon className="h-10 w-10 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Cycle Length</p>
                          <p className="text-lg font-bold">{cycles[0].cycleLength || '28'} days</p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              {cycles.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Your Cycle History</h3>
                  <div className="space-y-3">
                    {cycles.map((cycle, index) => (
                      <div key={cycle._id || index} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-pink-100 text-pink-800">Period</Badge>
                              <div className="font-medium">
                                {cycle.periodDays && cycle.periodDays.length > 0 ? (
                                  `${dayjs(cycle.periodDays[0]).format('MMM DD')} - ${dayjs(cycle.periodDays[cycle.periodDays.length - 1]).format('MMM DD, YYYY')}`
                                ) : 'No date data'}
                              </div>
                            </div>
                            
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                              <CalendarIcon className="h-4 w-4" />
                              {cycle.periodDays ? `${cycle.periodDays.length} days` : 'N/A'}
                            </div>
                            
                            {cycle.notes && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Notes:</span> {cycle.notes}
                              </div>
                            )}
                          </div>
                          
                          {cycle.symptoms && cycle.symptoms.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {cycle.symptoms.map((symptom, i) => (
                                <Badge key={i} variant="outline" className="bg-gray-100">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No cycle data available yet
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
