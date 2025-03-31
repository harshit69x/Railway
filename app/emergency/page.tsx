"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Ambulance, AmbulanceIcon as FirstAid, Phone, MapPin, Clock, Loader2 } from "lucide-react"
import { getTrainTrackingInfo, getTrainStations, type Station } from "@/lib/api/railway-service"
import { createEmergency } from "@/lib/supabase"
import { useCart } from "@/lib/cart"

export default function EmergencyPage() {
  const [pnrNumber, setPnrNumber] = useState<string | null>(null)
  const [passengerName, setPassengerName] = useState<string | null>(null)
  const [trackingInfo, setTrackingInfo] = useState<any>(null)
  const [stations, setStations] = useState<Station[]>([])
  const [selectedStation, setSelectedStation] = useState<string>("")
  const [patientDetails, setPatientDetails] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(false)
  const [emergencyType, setEmergencyType] = useState<string>("ambulance")
  const { pnrNumber: cartPnr, passengerName: cartPassengerName } = useCart()

  // Load PNR from cart store
  useEffect(() => {
    if (cartPnr && cartPassengerName) {
      setPnrNumber(cartPnr)
      setPassengerName(cartPassengerName)
      loadTrainInfo(cartPnr)
    }
  }, [cartPnr, cartPassengerName])

  const loadTrainInfo = async (pnr: string) => {
    setLoading(true)
    try {
      const info = await getTrainTrackingInfo(pnr)
      if (info) {
        setTrackingInfo(info)

        // Load stations for this train
        const trainStations = await getTrainStations(info.trainNumber.toString())
        setStations(trainStations)

        // Set default selected station to next station
        if (info.nextStation) {
          setSelectedStation(info.nextStation.code)
        }
      }
    } catch (error) {
      console.error("Error loading train info:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fix the emergency request function to properly handle the PNR number
  const handleEmergencyRequest = async (type: string) => {
    if (!pnrNumber || !selectedStation) return

    setLoading(true)
    try {
      await createEmergency({
        PNR: pnrNumber,
        StationCode: selectedStation,
        Emergency_Type: type,
      })

      setRequestSuccess(true)
      setEmergencyType(type)

      // Reset after 3 seconds
      setTimeout(() => {
        setRequestSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error creating emergency request:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Emergency Services</h1>
        <p className="text-muted-foreground">Get immediate medical assistance during your journey</p>
      </div>

      {/* SOS Section */}
      <div className="bg-red-100 dark:bg-red-950 p-8 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Emergency SOS</h2>
            </div>
            <p className="text-red-600/80 dark:text-red-400/80 mb-6">
              Press the SOS button for immediate medical assistance. Our emergency team will contact you immediately and
              coordinate with railway authorities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="destructive"
                size="lg"
                className="py-6 text-lg font-bold"
                onClick={() => handleEmergencyRequest("SOS")}
                disabled={loading || !pnrNumber}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> PROCESSING
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-5 w-5" /> SOS EMERGENCY
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white dark:bg-transparent text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
              >
                <Phone className="mr-2 h-5 w-5" /> Call Helpline
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/3 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold mb-4">Your Current Location</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Train className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">
                    {trackingInfo?.trainName || "Unknown"} ({trackingInfo?.trainNumber || ""})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Coach: {trackingInfo?.passengerInfo.coach || "Unknown"}, Seat:{" "}
                    {trackingInfo?.passengerInfo.berth || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Current Station</p>
                  <p className="text-sm text-muted-foreground">{trackingInfo?.currentStation?.name || "Unknown"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Next Station</p>
                  <p className="text-sm text-muted-foreground">
                    {trackingInfo?.nextStation?.name || "Unknown"}
                    {trackingInfo?.eta ? ` (ETA: ${trackingInfo.eta})` : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Services Tabs */}
      <Tabs defaultValue="ambulance" className="mb-8" value={emergencyType} onValueChange={setEmergencyType}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="ambulance">Ambulance</TabsTrigger>
          <TabsTrigger value="firstaid">First Aid Kit</TabsTrigger>
          <TabsTrigger value="oxygen">Oxygen Support</TabsTrigger>
        </TabsList>
        <TabsContent value="ambulance" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Book Ambulance</h2>
              <p className="text-muted-foreground mb-6">
                Pre-book an ambulance at your upcoming station for serious medical emergencies. Our team will coordinate
                with local ambulance services.
              </p>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Select Station</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedStation}
                        onChange={(e) => setSelectedStation(e.target.value)}
                        disabled={!pnrNumber || stations.length === 0}
                      >
                        {stations.length === 0 ? (
                          <option>Loading stations...</option>
                        ) : (
                          stations.map((station) => (
                            <option key={station.code} value={station.code}>
                              {station.name} {station.code === trackingInfo?.nextStation?.code ? "(Next Station)" : ""}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Patient Details</label>
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        placeholder="Describe the medical condition and any specific requirements"
                        value={patientDetails}
                        onChange={(e) => setPatientDetails(e.target.value)}
                      ></textarea>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleEmergencyRequest("ambulance")}
                      disabled={loading || !pnrNumber || !selectedStation}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                        </>
                      ) : requestSuccess && emergencyType === "ambulance" ? (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Ambulance Booked
                        </>
                      ) : (
                        "Book Ambulance"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Ambulance className="h-24 w-24 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Emergency Ambulance Service</h3>
                <p className="text-muted-foreground">
                  Our ambulance partners are available at all major railway stations across India.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="firstaid" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Request First Aid Kit</h2>
              <p className="text-muted-foreground mb-6">
                Request a first aid kit to be delivered to your seat for minor injuries or medical needs during your
                journey.
              </p>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Select Kit Type</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Standard First Aid Kit</option>
                        <option>Advanced First Aid Kit</option>
                        <option>Burn Treatment Kit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Delivery Details</label>
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        placeholder="Specify your coach number, seat number, and any specific requirements"
                        value={patientDetails}
                        onChange={(e) => setPatientDetails(e.target.value)}
                      ></textarea>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleEmergencyRequest("firstaid")}
                      disabled={loading || !pnrNumber}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                        </>
                      ) : requestSuccess && emergencyType === "firstaid" ? (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Kit Requested
                        </>
                      ) : (
                        "Request Kit"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <FirstAid className="h-24 w-24 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">First Aid Kit Service</h3>
                <p className="text-muted-foreground">
                  Our first aid kits contain essential medical supplies for common injuries and minor medical issues.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="oxygen" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Request Oxygen Support</h2>
              <p className="text-muted-foreground mb-6">
                Request oxygen support for breathing difficulties or respiratory issues during your journey.
              </p>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Oxygen Type</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Portable Oxygen Cylinder</option>
                        <option>Oxygen Concentrator</option>
                        <option>Oxygen Mask Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Patient Details</label>
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        placeholder="Describe the medical condition and oxygen requirements"
                        value={patientDetails}
                        onChange={(e) => setPatientDetails(e.target.value)}
                      ></textarea>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleEmergencyRequest("oxygen")}
                      disabled={loading || !pnrNumber}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                        </>
                      ) : requestSuccess && emergencyType === "oxygen" ? (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Oxygen Requested
                        </>
                      ) : (
                        "Request Oxygen"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="h-24 w-24 mx-auto text-primary mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 8C17.5 4.96243 15.0376 2.5 12 2.5C8.96243 2.5 6.5 4.96243 6.5 8C6.5 11.0376 8.96243 13.5 12 13.5C15.0376 13.5 17.5 11.0376 17.5 8Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M12 13.5V21.5M8.5 18H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Oxygen Support Service</h3>
                <p className="text-muted-foreground">
                  We provide emergency oxygen support for passengers experiencing breathing difficulties during their
                  journey.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Emergency Contacts */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Railway Emergency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">139</span>
                <Button size="sm" variant="outline">
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Medical Emergency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">108</span>
                <Button size="sm" variant="outline">
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Rail Meds Helpline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">1800-123-4567</span>
                <Button size="sm" variant="outline">
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Train({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <path d="M8 19l-2 3" />
      <path d="M16 19l2 3" />
    </svg>
  )
}

// Add the missing Check component
function Check({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

