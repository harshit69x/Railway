import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createOrder, deleteOrdersByPNR } from "@/lib/supabase"

export interface CartItem {
  id: string
  name: string
  quantity: number
  price: number
  image?: string
  category?: string
  prescriptionRequired?: boolean
}

interface CartState {
  items: CartItem[]
  pnrNumber: string | null
  passengerName: string | null
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setPNR: (pnr: string, name: string) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  syncWithSupabase: () => Promise<void>
  checkoutCart: () => Promise<boolean>
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      pnrNumber: null,
      passengerName: null,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)

          if (existingItem) {
            return {
              items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            }
          }

          return { items: [...state.items, item] }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      setPNR: (pnr, name) => {
        set({ pnrNumber: pnr, passengerName: name })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      syncWithSupabase: async () => {
        const { pnrNumber, passengerName } = get()

        if (!pnrNumber || !passengerName) {
          console.error("PNR or passenger name not set")
          return
        }

        try {
          // First, delete existing orders for this PNR
          await deleteOrdersByPNR(pnrNumber)

          // Then create new orders for each item in the cart
          const { items } = get()

          for (const item of items) {
            await createOrder({
              PNR: pnrNumber,
              Name: passengerName,
              Medicine: `${item.name} (Qty: ${item.quantity})`,
            })
          }
        } catch (error) {
          console.error("Error syncing cart with Supabase:", error)
        }
      },

      checkoutCart: async () => {
        try {
          await get().syncWithSupabase()
          get().clearCart()
          return true
        } catch (error) {
          console.error("Error checking out cart:", error)
          return false
        }
      },
    }),
    {
      name: "rail-meds-cart",
    },
  ),
)

