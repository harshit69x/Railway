import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)

// Generate a random ID
function generateRandomId(): number {
  const timestamp = Date.now(); // Get the current timestamp as a number
  const randomNum = Math.floor(Math.random() * 1_000_000); // Generate a random number
  return timestamp + randomNum; // Combine timestamp and random number
}

// Orders table functions
export async function getOrdersByPNR(pnr: string) {
  const { data, error } = await supabase.from("orders").select("*").eq("PNR", Number.parseInt(pnr)) // Convert to integer

  if (error) {
    console.error("Error fetching orders:", error)
    return null
  }

  return data
}

export async function createOrder(order: {
  PNR: string;
  Name: string;
  Medicine: string;
}) {
  const orderId = generateRandomId(); // Generate numeric ID

  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        id: orderId, // Use numeric ID
        PNR: Number.parseInt(order.PNR), // Convert to integer as the schema expects int8
        Name: order.Name,
        Medicine: order.Medicine,
      },
    ])
    .select();

  if (error) {
    console.error("Error creating order:", error);
    return null;
  }

  return data;
}

export async function deleteOrdersByPNR(pnr: string) {
  const { error } = await supabase.from("orders").delete().eq("PNR", Number.parseInt(pnr)) // Convert to integer

  if (error) {
    console.error("Error deleting orders:", error)
    return false
  }

  return true
}

export async function getOrderById(orderId: string, retries = 3, delay = 500): Promise<any> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single(); // Fetch a single order

    if (!error && data) {
      return data; // Return the data if found
    }

    if (attempt < retries - 1) {
      console.warn(`Retrying fetch for order ID ${orderId} (Attempt ${attempt + 1})`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
    } else {
      console.error("Error fetching order after retries:", error);
    }
  }

  return null; // Return null if all retries fail
}

// Emergency table functions
export async function getEmergenciesByPNR(pnr: string) {
  const { data, error } = await supabase.from("emergency").select("*").eq("PNR", Number.parseInt(pnr)) // Convert to integer

  if (error) {
    console.error("Error fetching emergencies:", error)
    return null
  }

  return data
}

export async function createEmergency(emergency: {
  PNR: string;
  StationCode: string;
  Emergency_Type: string;
}) {
  const emergencyId = generateRandomId(); // Generate numeric ID

  const { data, error } = await supabase
    .from("emergency")
    .insert([
      {
        id: emergencyId, // Use numeric ID
        PNR: Number.parseInt(emergency.PNR), // Convert to integer as the schema expects int8
        StationCode: emergency.StationCode,
        Emergency_Type: emergency.Emergency_Type,
      },
    ])
    .select();

  if (error) {
    console.error("Error creating emergency:", error);
    return null;
  }

  return data;
}

