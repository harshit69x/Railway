"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, Clock, Video, Phone, Check, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart"
import { createOrder } from "@/lib/supabase"

// Sample doctors data
const doctorsData = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    experience: "12 years",
    languages: "English, Hindi",
    nextAvailable: "Today, 3:00 PM",
    rating: 4.9,
    reviews: 120,
    image: "/placeholder.svg?height=64&width=64",
    fee: 500,
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    specialty: "Pediatrician",
    experience: "8 years",
    languages: "English, Hindi, Bengali",
    nextAvailable: "Today, 5:30 PM",
    rating: 4.8,
    reviews: 95,
    image: "/placeholder.svg?height=64&width=64",
    fee: 600,
  },
  {
    id: "3",
    name: "Dr. Amit Patel",
    specialty: "Cardiologist",
    experience: "15 years",
    languages: "English, Hindi, Gujarati",
    nextAvailable: "Tomorrow, 10:00 AM",
    rating: 4.9,
    reviews: 210,
    image: "/placeholder.svg?height=64&width=64",
    fee: 1000,
  },
  {
    id: "4",
    name: "Dr. Sneha Reddy",
    specialty: "General Physician",
    experience: "6 years",
    languages: "English, Hindi, Telugu",
    nextAvailable: "Today, 7:00 PM",
    rating: 4.7,
    reviews: 78,
    image: "/placeholder.svg?height=64&width=64",
    fee: 450,
  },
  {
    id: "5",
    name: "Dr. Vikram Singh",
    specialty: "Pediatrician",
    experience: "10 years",
    languages: "English, Hindi, Punjabi",
    nextAvailable: "Tomorrow, 12:30 PM",
    rating: 4.8,
    reviews: 145,
    image: "/placeholder.svg?height=64&width=64",
    fee: 550,
  },
  {
    id: "6",
    name: "Dr. Meera Joshi",
    specialty: "Cardiologist",
    experience: "14 years",
    languages: "English, Hindi, Marathi",
    nextAvailable: "Tomorrow, 2:00 PM",
    rating: 4.9,
    reviews: 180,
    image: "/placeholder.svg?height=64&width=64",
    fee: 950,
  },
]

export default function DoctorsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [booked, setBooked] = useState<Record<string, boolean>>({})
  const { pnrNumber, passengerName } = useCart()

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (!query) {
      setFilteredDoctors(doctorsData)
      return
    }

    const filtered = doctorsData.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(query.toLowerCase()),
    )

    setFilteredDoctors(filtered)
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    if (value === "all") {
      setFilteredDoctors(doctorsData)
      return
    }

    const filtered = doctorsData.filter((doctor) => doctor.specialty.toLowerCase() === value.toLowerCase())

    setFilteredDoctors(filtered)
  }

  // Book appointment
  const bookAppointment = async (doctorId: string, appointmentType: "video" | "audio") => {
    if (!pnrNumber || !passengerName) {
      alert("Please track your train with PNR first")
      return
    }

    setLoading((prev) => ({ ...prev, [doctorId]: true }))

    try {
      const doctor = doctorsData.find((d) => d.id === doctorId)
      if (!doctor) return

      await createOrder({
        PNR: pnrNumber,
        Name: passengerName,
        Medicine: `${appointmentType.charAt(0).toUpperCase() + appointmentType.slice(1)} consultation with ${doctor.name}`,
      })

      setBooked((prev) => ({ ...prev, [doctorId]: true }))

      // Reset after 3 seconds
      setTimeout(() => {
        setBooked((prev) => ({ ...prev, [doctorId]: false }))
      }, 3000)
    } catch (error) {
      console.error("Error booking appointment:", error)
    } finally {
      setLoading((prev) => ({ ...prev, [doctorId]: false }))
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Doctor Consultation</h1>
        <p className="text-muted-foreground">Connect with certified doctors during your journey</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name or specialty..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="md:w-auto">
          <Calendar className="mr-2 h-4 w-4" /> Select Date
        </Button>
        <Button variant="outline" className="md:w-auto">
          <Clock className="mr-2 h-4 w-4" /> Select Time
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-8" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="all">All Specialists</TabsTrigger>
          <TabsTrigger value="general physician">General Physician</TabsTrigger>
          <TabsTrigger value="pediatrician">Pediatrician</TabsTrigger>
          <TabsTrigger value="cardiologist">Cardiologist</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-medium">No doctors found matching your search</p>
          <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
          <Button variant="outline" className="mt-4" onClick={() => handleSearch("")}>
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              loading={loading[doctor.id] || false}
              booked={booked[doctor.id] || false}
              onBookAppointment={(type) => bookAppointment(doctor.id, type)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" disabled>
            &lt;
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="icon">
            &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}

function DoctorCard({
  doctor,
  loading,
  booked,
  onBookAppointment,
}: {
  doctor: any
  loading: boolean
  booked: boolean
  onBookAppointment: (type: "video" | "audio") => void
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4 mb-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
            <img src={doctor.image || "/placeholder.svg"} alt={doctor.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <h3 className="font-semibold">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
            <div className="flex items-center mt-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs ml-1">
                {doctor.rating} ({doctor.reviews} reviews)
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Experience</span>
            <span className="font-medium">{doctor.experience}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Languages</span>
            <span className="font-medium">{doctor.languages}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Next Available</span>
            <span className="font-medium">{doctor.nextAvailable}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Consultation Fee</span>
            <span className="font-medium">₹{doctor.fee}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            variant="outline"
            className="flex items-center justify-center"
            onClick={() => onBookAppointment("video")}
            disabled={loading || booked}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : booked ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Booked
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" /> Video Call
              </>
            )}
          </Button>
          <Button
            className="flex items-center justify-center"
            onClick={() => onBookAppointment("audio")}
            disabled={loading || booked}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : booked ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Booked
              </>
            ) : (
              <>
                <Phone className="mr-2 h-4 w-4" /> Audio Call
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

