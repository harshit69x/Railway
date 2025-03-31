"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Train, MapPin, Clock, AlertCircle, Loader2, User } from "lucide-react"
import { getTrainTrackingInfo, type TrainTrackingInfo } from "@/lib/api/railway-service"
import { useCart } from "@/lib/cart"

export function TrainTracker() {
  const [pnr, setPnr] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [trackingInfo, setTrackingInfo] = useState<TrainTrackingInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setPNR } = useCart()

  const handleTrackTrain = async () => {
    if (pnr.length === 10) {
      setLoading(true)
      setError(null)

      try {
        const info = await getTrainTrackingInfo(pnr)
        if (info) {
          setTrackingInfo(info)
          setIsTracking(true)

          // Set PNR and passenger name in the cart store
          if (info.passengerInfo.passengerName) {
            setPNR(pnr, info.passengerInfo.passengerName)
          }
        } else {
          setError("Could not retrieve train information. Please try again.")
        }
      } catch (err) {
        setError("An error occurred while tracking the train. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }

  // For demo purposes, auto-fill a PNR number
  useEffect(() => {
    setPnr("2430836549")
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Train className="h-5 w-5" /> Train Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isTracking ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Enter your PNR number to track your train and get medicine delivery at the right station
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter 10-digit PNR number"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleTrackTrain} disabled={pnr.length !== 10 || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Tracking
                  </>
                ) : (
                  "Track"
                )}
              </Button>
            </div>
            {error && (
              <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  {trackingInfo?.trainName} ({trackingInfo?.trainNumber})
                </h3>
                <p className="text-sm text-muted-foreground">PNR: {pnr}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsTracking(false)}>
                Change
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="flex flex-col items-center">
                <MapPin className="h-5 w-5 text-muted-foreground mb-1" />
                <p className="text-sm font-medium">Current Station</p>
                <p className="text-sm text-muted-foreground">{trackingInfo?.currentStation?.name || "Unknown"}</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-5 w-5 text-muted-foreground mb-1" />
                <p className="text-sm font-medium">Next Station</p>
                <p className="text-sm text-muted-foreground">{trackingInfo?.nextStation?.name || "Unknown"}</p>
              </div>
              <div className="flex flex-col items-center">
                <Train className="h-5 w-5 text-muted-foreground mb-1" />
                <p className="text-sm font-medium">ETA</p>
                <p className="text-sm text-muted-foreground">{trackingInfo?.eta || "Unknown"}</p>
              </div>
            </div>

            <div className="bg-primary/10 p-3 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">{trackingInfo?.passengerInfo.passengerName || "Passenger"}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Coach: {trackingInfo?.passengerInfo.coach}, Seat: {trackingInfo?.passengerInfo.berth} (
                {trackingInfo?.passengerInfo.berthType})
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

