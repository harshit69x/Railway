"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Loader2, CreditCard, Banknote, Train, MapPin, AlertCircle } from "lucide-react"
import { getTrainTrackingInfo, type TrainTrackingInfo } from "@/lib/api/railway-service"
import { useCart } from "@/lib/cart"

export default function CheckoutPage() {
  const router = useRouter()
  const [pnrNumber, setPnrNumber] = useState("2430836549")
  const [passengerName, setPassengerName] = useState<string | null>(null)
  const [deliveryType, setDeliveryType] = useState<"station" | "seat">("seat")
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod")
  const [loading, setLoading] = useState(false)
  const [verifyingPnr, setVerifyingPnr] = useState(false)
  const [trackingInfo, setTrackingInfo] = useState<TrainTrackingInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Get cart items from the cart store
  const { items, pnrNumber: cartPnr, passengerName: cartPassengerName, checkoutCart, getTotalPrice } = useCart()

  // Calculate total
  const subtotal = getTotalPrice()
  const deliveryFee = deliveryType === "seat" ? 30 : 0
  const total = subtotal + deliveryFee

  useEffect(() => {
    if (cartPnr) {
      setPnrNumber(cartPnr)
      if (cartPassengerName) {
        setPassengerName(cartPassengerName)
      }
    }
  }, [cartPnr, cartPassengerName])

  const handleVerifyPnr = async () => {
    if (pnrNumber.length !== 10) {
      setError("Please enter a valid 10-digit PNR number")
      return
    }

    setVerifyingPnr(true)
    setError(null)

    try {
      const info = await getTrainTrackingInfo(pnrNumber)
      if (info) {
        setTrackingInfo(info)
      } else {
        setError("Could not verify PNR. Please check the number and try again.")
      }
    } catch (err) {
      setError("An error occurred while verifying PNR. Please try again.")
      console.error(err)
    } finally {
      setVerifyingPnr(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!pnrNumber) {
      setError("Please enter your PNR number.")
      return
    }

    if (items.length === 0) {
      setError("Your cart is empty. Please add items to your cart before checkout.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Prepare order summary
      const orderSummary = {
        pnrNumber,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getTotalPrice() + 30, // Add delivery fee
        paymentMethod,
      }

      // Navigate to the confirmation page with the PNR and order summary
      const queryString = new URLSearchParams({
        pnr: pnrNumber,
        orderSummary: JSON.stringify(orderSummary),
      }).toString()

      router.push(`/orders/confirmation?${queryString}`)

      // Clear the cart after navigating
      await checkoutCart()
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Your cart is empty. Please add items to your cart.</p>
                  <Button className="mt-4" onClick={() => router.push("/medicines")}>
                    Browse Medicines
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-muted rounded-md overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="font-medium">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* PNR Verification */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>PNR Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pnr">PNR Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="pnr"
                      placeholder="Enter 10-digit PNR number"
                      value={pnrNumber}
                      onChange={(e) => setPnrNumber(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleVerifyPnr} disabled={pnrNumber.length !== 10 || verifyingPnr}>
                      {verifyingPnr ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying
                        </>
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {trackingInfo && (
                  <div className="bg-primary/10 p-4 rounded-md">
                    <h3 className="font-semibold mb-2">Train Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Train className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">
                            {trackingInfo.trainName} ({trackingInfo.trainNumber})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Coach: {trackingInfo.passengerInfo.coach}, Seat: {trackingInfo.passengerInfo.berth} (
                            {trackingInfo.passengerInfo.berthType})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Delivery at Next Station</p>
                          <p className="text-sm text-muted-foreground">
                            {trackingInfo.nextStation?.name} (ETA: {trackingInfo.eta})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Delivery Options</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={deliveryType}
                onValueChange={(value) => setDeliveryType(value as "station" | "seat")}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="seat" id="seat" />
                  <Label htmlFor="seat" className="flex-1">
                    <div className="font-medium">Seat Delivery</div>
                    <div className="text-sm text-muted-foreground">Delivered directly to your seat (₹30 extra)</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="station" id="station" />
                  <Label htmlFor="station" className="flex-1">
                    <div className="font-medium">Station Pickup</div>
                    <div className="text-sm text-muted-foreground">Collect from our counter at the station (Free)</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as "cod" | "online")}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    <span>Cash on Delivery</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Online Payment</span>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "online" && (
                <div className="mt-4 p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground mb-4">
                    This is a demo application. No actual payment will be processed.
                  </p>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee > 0 ? `₹${deliveryFee}` : "Free"}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={!trackingInfo || loading || items.length === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

