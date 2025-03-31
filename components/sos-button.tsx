import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export function SOSButton() {
  return (
    <div className="bg-gradient-to-r from-red-100 to-red-50 dark:from-red-950 dark:to-red-900 p-6 rounded-lg text-center shadow-lg">
      <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-vibrant-red" />
      <h3 className="text-xl font-bold text-vibrant-red mb-2">Emergency SOS</h3>
      <p className="text-red-600/80 dark:text-red-400/80 mb-4">
        Need immediate medical assistance? Tap the SOS button below.
      </p>
      <Link href="/emergency">
        <Button
          variant="destructive"
          size="lg"
          className="w-full py-6 text-lg font-bold bg-vibrant-red hover:bg-vibrant-red/90 animate-pulse-scale"
        >
          SOS EMERGENCY
        </Button>
      </Link>
    </div>
  )
}

