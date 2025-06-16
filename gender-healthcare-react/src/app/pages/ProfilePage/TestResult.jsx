import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ForumComponents/ui/card"
import { Button } from "../../components/ForumComponents/ui/button"
import { Badge } from "../../components/ForumComponents/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ForumComponents/ui/tabs"
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
import { CalendarIcon, Clock, Download, FileText, Plus, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ForumComponents/ui/table"

// Mock data for test results
const testResults = [
  {
    id: 1,
    name: "STI Panel",
    date: "May 10, 2025",
    status: "completed",
    results: "Negative",
    doctor: "Dr. Sarah Smith",
    notes: "All tests negative. Recommended follow-up in 6 months.",
  },
  {
    id: 2,
    name: "Pap Smear",
    date: "January 15, 2025",
    status: "completed",
    results: "Normal",
    doctor: "Dr. Sarah Smith",
    notes: "Results normal. Next screening in 3 years.",
  },
  {
    id: 3,
    name: "Hormone Panel",
    date: "November 5, 2024",
    status: "completed",
    results: "See details",
    doctor: "Dr. James Wilson",
    notes: "Estrogen levels slightly elevated. Recommended follow-up in 3 months.",
  },
]

// Mock data for upcoming tests
const upcomingTests = [
  {
    id: 4,
    name: "STI Panel",
    date: "June 20, 2025",
    time: "10:30 AM",
    location: "Main Clinic",
    status: "scheduled",
    instructions: "Fast for 8 hours before the test. Bring ID and insurance card.",
  },
]

export default function TestResults() {
  const [open, setOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Scheduled</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getResultsBadge = (results) => {
    switch (results) {
      case "Negative":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Negative</Badge>
      case "Positive":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Positive</Badge>
      case "Normal":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Normal</Badge>
      case "Abnormal":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Abnormal</Badge>
      default:
        return <Badge variant="outline">{results}</Badge>
    }
  }

  const viewTestDetails = (test) => {
    setSelectedTest(test)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>View and manage your test results</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Book Test
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Book New Test</DialogTitle>
                <DialogDescription>Schedule a test at our facility</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="test-type">Test Type</Label>
                  <Select>
                    <SelectTrigger id="test-type">
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sti-panel">STI Panel</SelectItem>
                      <SelectItem value="pap-smear">Pap Smear</SelectItem>
                      <SelectItem value="hormone-panel">Hormone Panel</SelectItem>
                      <SelectItem value="pregnancy">Pregnancy Test</SelectItem>
                      <SelectItem value="hiv">HIV Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Select>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main-clinic">Main Clinic</SelectItem>
                      <SelectItem value="downtown">Downtown Office</SelectItem>
                      <SelectItem value="north">North Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Book Test</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Test Details</DialogTitle>
                <DialogDescription>
                  {selectedTest?.name} - {selectedTest?.date}
                </DialogDescription>
              </DialogHeader>
              {selectedTest && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Status</h3>
                      {getStatusBadge(selectedTest.status)}
                    </div>
                    <div>
                      <h3 className="font-medium">Results</h3>
                      {getResultsBadge(selectedTest.results)}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">Provider</h3>
                    <p>{selectedTest.doctor}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Notes</h3>
                    <p className="text-sm">{selectedTest.notes}</p>
                  </div>

                  {selectedTest.name === "Hormone Panel" && (
                    <div>
                      <h3 className="font-medium mb-2">Detailed Results</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead>Reference Range</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Estradiol</TableCell>
                            <TableCell>210 pg/mL</TableCell>
                            <TableCell>30-400 pg/mL</TableCell>
                            <TableCell>Normal</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Progesterone</TableCell>
                            <TableCell>12 ng/mL</TableCell>
                            <TableCell>5-20 ng/mL</TableCell>
                            <TableCell>Normal</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>FSH</TableCell>
                            <TableCell>6.5 mIU/mL</TableCell>
                            <TableCell>4.7-21.5 mIU/mL</TableCell>
                            <TableCell>Normal</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>LH</TableCell>
                            <TableCell>12.8 mIU/mL</TableCell>
                            <TableCell>2.0-15.0 mIU/mL</TableCell>
                            <TableCell>Normal</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="results">
            <TabsList className="mb-4">
              <TabsTrigger value="results">Past Results</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Tests</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-4">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search test results..." className="pl-8" />
              </div>

              <div className="space-y-4">
                {testResults.map((test) => (
                  <Card key={test.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-blue-100">
                            <FileText className="h-5 w-5 text-blue-700" />
                          </div>
                          <div>
                            <h4 className="font-medium">{test.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{test.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>Provider:</span>
                                <span>{test.doctor}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(test.status)}
                          {getResultsBadge(test.results)}
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewTestDetails(test)}>
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingTests.length > 0 ? (
                upcomingTests.map((test) => (
                  <Card key={test.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-blue-100">
                            <FileText className="h-5 w-5 text-blue-700" />
                          </div>
                          <div>
                            <h4 className="font-medium">{test.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{test.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{test.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>Location:</span>
                                <span>{test.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>{getStatusBadge(test.status)}</div>
                      </div>
                      {test.instructions && (
                        <div className="mt-3 p-2 bg-blue-50 text-blue-800 rounded-md text-sm">
                          <p className="font-medium">Instructions:</p>
                          <p>{test.instructions}</p>
                        </div>
                      )}
                      <div className="mt-3 flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming tests scheduled</p>
                  <Button variant="outline" className="mt-4" onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Book Test
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
