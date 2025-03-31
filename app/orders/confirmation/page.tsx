"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"
import { getOrderById } from "@/lib/supabase"

interface OrderDetails {
  id: string
  PNR: string
  Name: string
  Medicine: string
  createdAt: string
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return

      setLoading(true)
      const fetchedOrder = await getOrderById(orderId, 3, 500) // Retry 3 times with 500ms delay
      setOrder(fetchedOrder)
      setLoading(false)
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
        <Card>
          <CardContent className="p-6">
            <p>Loading order details...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
        <Card>
          <CardContent className="p-6">
            <p>No order information found. Please check your order ID.</p>
            <Link href="/medicines">
              <Button className="mt-4">Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Your order #{order.id} has been placed successfully</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Passenger Name</p>
                  <p className="font-medium">{order.Name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PNR</p>
                  <p className="font-medium">{order.PNR}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{order.Medicine}</p>
                    </div>
                  </div>
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

