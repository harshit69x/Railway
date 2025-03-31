"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Calendar, Clock, FileText, Settings, Bell, Pill, Phone, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart"
import { getOrdersByPNR, getEmergenciesByPNR } from "@/lib/supabase"
import { getTrainTrackingInfo } from "@/lib/api/railway-service"

// Add the missing AlertTriangle icon import
import { AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("orders")
  const [orders, setOrders] = useState<any[]>([])
  const [emergencies, setEmergencies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [trackingInfo, setTrackingInfo] = useState<any>(null)
  const { pnrNumber, passengerName } = useCart()

  useEffect(() => {
    const loadData = async () => {
      if (!pnrNumber) return

      setLoading(true)
      try {
        // Load orders
        const ordersData = await getOrdersByPNR(pnrNumber)
        if (ordersData) {
          setOrders(ordersData)
        }

        // Load emergencies
        const emergenciesData = await getEmergenciesByPNR(pnrNumber)
        if (emergenciesData) {
          setEmergencies(emergenciesData)
        }

        // Load train tracking info
        const info = await getTrainTrackingInfo(pnrNumber)
        if (info) {
          setTrackingInfo(info)
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [pnrNumber])

  if (!pnrNumber) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted p-6 rounded-full mb-4">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Rail Meds</h1>
          <p className="text-muted-foreground max-w-md mb-6">
            Please track your train with your PNR number to view your dashboard
          </p>
          <Button onClick={() => (window.location.href = "/")}>Go to Home</Button>
        </div>
      </div>
    )
  }

  const emergencyContent = (
    <>
      <h3 className="text-xl font-semibold mb-4">Emergency Requests</h3>
      <div className="space-y-4">
        {emergencies.map((emergency, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className="h-16 w-16 bg-red-100 dark:bg-red-900 rounded-md flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold capitalize">{emergency.Emergency_Type} Request</h4>
                    <p className="text-sm text-muted-foreground">Station: {emergency.StationCode}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Requested on {new Date(emergency.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      In Progress
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )

  const updatedEmergencyTabsContent = (
    <TabsContent value="emergency" className="pt-6">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : emergencies.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Emergency Requests</h3>
          <p className="text-muted-foreground mb-6">You haven't requested any emergency services yet</p>
          <Button onClick={() => (window.location.href = "/emergency")}>Request Emergency</Button>
        </div>
      ) : (
        emergencyContent
      )}
    </TabsContent>
  )

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your orders, consultations, and medical records</p>
        </div>
        <Button variant="outline">
          <Bell className="mr-2 h-4 w-4" /> Notifications
        </Button>
      </div>

      {/* User Profile Summary */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-muted">
              <img src="/placeholder.svg?height=96&width=96" alt="User" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-1">{passengerName || "User"}</h2>
              <p className="text-muted-foreground mb-4">PNR: {pnrNumber}</p>
              {trackingInfo && (
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-primary/10 px-4 py-2 rounded-md">
                    <p className="text-xs text-muted-foreground">Current Journey</p>
                    <p className="font-medium">
                      {trackingInfo.trainName} ({trackingInfo.trainNumber})
                    </p>
                  </div>
                  <div className="bg-primary/10 px-4 py-2 rounded-md">
                    <p className="text-xs text-muted-foreground">Next Station</p>
                    <p className="font-medium">{trackingInfo.nextStation?.name || "Unknown"}</p>
                  </div>
                  <div className="bg-primary/10 px-4 py-2 rounded-md">
                    <p className="text-xs text-muted-foreground">Seat</p>
                    <p className="font-medium">
                      {trackingInfo.passengerInfo.coach} - {trackingInfo.passengerInfo.berth}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <User className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="orders" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="pt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground mb-6">You haven't placed any medicine orders yet</p>
              <Button onClick={() => (window.location.href = "/medicines")}>Browse Medicines</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Active Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{orders.length}</div>
                    <p className="text-muted-foreground">Orders in progress</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Delivery Station</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{trackingInfo?.nextStation?.name || "Unknown"}</div>
                    <p className="text-muted-foreground">ETA: {trackingInfo?.eta || "Unknown"}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Spent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{orders.length * 250}</div>
                    <p className="text-muted-foreground">On medicines & services</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                            <Pill className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Order #{order.id || index + 1}</h4>
                            <p className="text-sm text-muted-foreground">{order.Medicine}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Ordered on {new Date(order.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              In Transit
                            </span>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="consultations" className="pt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Upcoming Consultations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {orders.filter((o) => o.Medicine.includes("consultation")).length}
                    </div>
                    <p className="text-muted-foreground">Scheduled appointments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Past Consultations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">0</div>
                    <p className="text-muted-foreground">Completed appointments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Available Doctors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">24</div>
                    <p className="text-muted-foreground">Ready for consultation</p>
                  </CardContent>
                </Card>
              </div>

              {orders.filter((o) => o.Medicine.includes("consultation")).length > 0 ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
                  <div className="space-y-4">
                    {orders
                      .filter((o) => o.Medicine.includes("consultation"))
                      .map((order, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div className="flex gap-4">
                                <div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
                                  <img
                                    src="/placeholder.svg?height=64&width=64"
                                    alt="Doctor"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-semibold">{order.Medicine}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(order.created_at).toLocaleDateString()},{" "}
                                      {new Date(order.created_at).toLocaleTimeString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Button variant="outline" size="sm" className="flex items-center">
                                  <FileText className="mr-2 h-4 w-4" /> View Details
                                </Button>
                                <Button size="sm" className="flex items-center">
                                  <Phone className="mr-2 h-4 w-4" /> Join Call
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Phone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Consultations Yet</h3>
                  <p className="text-muted-foreground mb-6">You haven't booked any doctor consultations yet</p>
                  <Button onClick={() => (window.location.href = "/doctors")}>Book Consultation</Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {updatedEmergencyTabsContent}
      </Tabs>
    </div>
  )
}

