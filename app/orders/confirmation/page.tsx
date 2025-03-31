"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, MapPin, Train, Clock, ArrowRight } from "lucide-react"
import { getTrainTrackingInfo, type TrainTrackingInfo } from "@/lib/api/railway-service"
import { useState,useEffect } from "react";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const pnr = searchParams.get("pnr")
  const orderSummaryParam = searchParams.get("orderSummary")
  const orderSummary = orderSummaryParam ? JSON.parse(orderSummaryParam) : null

  const [trackingInfo, setTrackingInfo] = useState<TrainTrackingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      if (!pnr) {
        setError("PNR is missing. Please try again.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const trackingData = await getTrainTrackingInfo(pnr)

        if (!trackingData) {
          throw new Error("Failed to fetch tracking information.")
        }

        setTrackingInfo(trackingData)
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching tracking information.")
      } finally {
        setLoading(false)
      }
    }

    fetchTrackingInfo()
  }, [pnr])

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
        <Card>
          <CardContent className="p-6">
            <p>Loading tracking information...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !trackingInfo || !orderSummary) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
        <Card>
          <CardContent className="p-6">
            <p>{error || "Failed to load tracking information. Please try again later."}</p>
            <Link href="/dashboard">
              <Button className="mt-4">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { items, totalAmount, paymentMethod } = orderSummary

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">You can review your order in the dashboard.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Delivery Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Train className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {trackingInfo.trainName} ({trackingInfo.trainNumber})
                      </p>
                      <p className="text-sm text-muted-foreground">PNR: {trackingInfo.pnrNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        Coach: {trackingInfo.passengerInfo.coach}, Seat: {trackingInfo.passengerInfo.berth} (
                        {trackingInfo.passengerInfo.berthType})
                      </p>
                      {trackingInfo.passengerInfo.passengerName && (
                        <p className="text-sm text-muted-foreground">
                          Passenger: {trackingInfo.passengerInfo.passengerName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Delivery to Seat</p>
                      <p className="text-sm text-muted-foreground">{trackingInfo.stationName} Station</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        ETA: {trackingInfo.eta}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={item.id || index} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                  <p>Total</p>
                  <p>₹{totalAmount}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button variant="outline">View Dashboard</Button>
          </Link>
          <Link href="/medicines">
            <Button>
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

