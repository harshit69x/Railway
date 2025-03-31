import { NextResponse } from "next/server"
import { getTrainTrackingInfo } from "@/lib/api/railway-service"

export interface OrderRequest {
  pnrNumber: string
  items: {
    id: string
    name: string
    quantity: number
    price: number
  }[]
  deliveryType: "station" | "seat"
  paymentMethod: "cod" | "online"
  prescriptionRequired: boolean
  prescriptionUrl?: string
}

export async function POST(request: Request) {
  try {
    const body: OrderRequest = await request.json()

    // Validate request
    if (!body.pnrNumber || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Invalid request. Missing required fields." }, { status: 400 })
    }

    // Check if prescription is required but not provided
    if (body.prescriptionRequired && !body.prescriptionUrl) {
      return NextResponse.json({ error: "Prescription is required for this order but not provided." }, { status: 400 })
    }

    // Get train tracking information to determine delivery station
    const trackingInfo = await getTrainTrackingInfo(body.pnrNumber)

    if (!trackingInfo) {
      return NextResponse.json({ error: "Could not retrieve train information. Please try again." }, { status: 400 })
    }

    // Determine delivery station based on tracking info
    const deliveryStation = trackingInfo.nextStation

    if (!deliveryStation) {
      return NextResponse.json(
        { error: "Could not determine delivery station. Train may have reached its destination." },
        { status: 400 },
      )
    }

    // Calculate total amount
    const totalAmount = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Create order object
    const order = {
      id: `ORD${Date.now()}`,
      pnrNumber: body.pnrNumber,
      trainNumber: trackingInfo.trainNumber,
      trainName: trackingInfo.trainName,
      items: body.items,
      totalAmount,
      deliveryType: body.deliveryType,
      deliveryStation: {
        code: deliveryStation.code,
        name: deliveryStation.name,
        eta: trackingInfo.eta,
      },
      passengerInfo: {
        coach: trackingInfo.passengerInfo.coach,
        berth: trackingInfo.passengerInfo.berth,
        berthType: trackingInfo.passengerInfo.berthType,
      },
      paymentMethod: body.paymentMethod,
      prescriptionRequired: body.prescriptionRequired,
      prescriptionUrl: body.prescriptionUrl,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }

    // In a real application, you would save this order to a database
    // For now, we'll just return the order object

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order,
    })
  } catch (error) {
    console.error("Error processing order:", error)
    return NextResponse.json({ error: "An error occurred while processing your order." }, { status: 500 })
  }
}

