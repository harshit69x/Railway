"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Check } from "lucide-react"
import { useCart, type CartItem } from "@/lib/cart"
import { CartButton } from "@/components/cart-button"

// Medicine categories
const categories = [
  "Fever & Pain Relief",
  "Stomach Care",
  "First Aid",
  "Diabetes Care",
  "Cardiac Care",
  "Respiratory Care",
  "Skin Care",
  "Eye & Ear Care",
]

// Sample medicines data
const medicinesData = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    category: "Fever & Pain Relief",
    price: 25,
    image: "/placeholder.svg?height=150&width=150",
    description: "Strip of 10 tablets",
    prescriptionRequired: false,
    popular: true,
  },
  {
    id: "2",
    name: "Cetirizine 10mg",
    category: "Respiratory Care",
    price: 35,
    image: "/placeholder.svg?height=150&width=150",
    description: "Strip of 10 tablets",
    prescriptionRequired: false,
    popular: true,
  },
  {
    id: "3",
    name: "Omeprazole 20mg",
    category: "Stomach Care",
    price: 85,
    image: "/placeholder.svg?height=150&width=150",
    description: "Strip of 10 tablets",
    prescriptionRequired: false,
    popular: false,
  },
  {
    id: "4",
    name: "Amoxicillin 500mg",
    category: "Fever & Pain Relief",
    price: 120,
    image: "/placeholder.svg?height=150&width=150",
    description: "Strip of 10 tablets",
    prescriptionRequired: true,
    popular: false,
  },
  {
    id: "5",
    name: "First Aid Kit",
    category: "First Aid",
    price: 150,
    image: "/placeholder.svg?height=150&width=150",
    description: "Basic first aid supplies",
    prescriptionRequired: false,
    popular: true,
  },
  {
    id: "6",
    name: "Metformin 500mg",
    category: "Diabetes Care",
    price: 45,
    image: "/placeholder.svg?height=150&width=150",
    description: "Strip of 10 tablets",
    prescriptionRequired: true,
    popular: false,
  },
  {
    id: "7",
    name: "Aspirin 75mg",
    category: "Cardiac Care",
    price: 30,
    image: "/placeholder.svg?height=150&width=150",
    description: "Strip of 14 tablets",
    prescriptionRequired: false,
    popular: true,
  },
  {
    id: "8",
    name: "Bandage Roll",
    category: "First Aid",
    price: 40,
    image: "/placeholder.svg?height=150&width=150",
    description: "5m x 10cm",
    prescriptionRequired: false,
    popular: false,
  },
  {
    id: "9",
    name: "Antiseptic Solution",
    category: "First Aid",
    price: 65,
    image: "/placeholder.svg?height=150&width=150",
    description: "100ml bottle",
    prescriptionRequired: false,
    popular: false,
  },
]

export default function MedicinesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [prescriptionFilter, setPrescriptionFilter] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [filteredMedicines, setFilteredMedicines] = useState(medicinesData)

  const { items, addItem } = useCart()

  // Check if item is in cart
  const isInCart = (id: string) => {
    return items.some((item) => item.id === id)
  }

  // Apply filters
  useEffect(() => {
    let filtered = medicinesData

    // Apply tab filter
    if (activeTab === "popular") {
      filtered = filtered.filter((med) => med.popular)
    } else if (activeTab === "prescription") {
      filtered = filtered.filter((med) => med.prescriptionRequired)
    } else if (activeTab === "otc") {
      filtered = filtered.filter((med) => !med.prescriptionRequired)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (med) => med.name.toLowerCase().includes(query) || med.category.toLowerCase().includes(query),
      )
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((med) => selectedCategories.includes(med.category))
    }

    // Apply prescription filter
    if (prescriptionFilter === "prescription") {
      filtered = filtered.filter((med) => med.prescriptionRequired)
    } else if (prescriptionFilter === "otc") {
      filtered = filtered.filter((med) => !med.prescriptionRequired)
    }

    // Apply price range filter
    const min = priceRange.min ? Number.parseInt(priceRange.min) : 0
    const max = priceRange.max ? Number.parseInt(priceRange.max) : Number.POSITIVE_INFINITY

    filtered = filtered.filter((med) => med.price >= min && med.price <= max)

    setFilteredMedicines(filtered)
  }, [activeTab, searchQuery, selectedCategories, prescriptionFilter, priceRange])

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([])
    setPrescriptionFilter(null)
    setPriceRange({ min: "", max: "" })
  }

  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Add to cart
  const handleAddToCart = (medicine: any) => {
    const cartItem: CartItem = {
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      quantity: 1,
      image: medicine.image,
      category: medicine.category,
      prescriptionRequired: medicine.prescriptionRequired,
    }

    addItem(cartItem)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Medicines</h1>
          <p className="text-muted-foreground">Order medicines for delivery at your train seat or station</p>
        </div>
        <CartButton />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          id={category.toLowerCase().replace(/\s+/g, "-")}
                          className="mr-2"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                        />
                        <label htmlFor={category.toLowerCase().replace(/\s+/g, "-")}>{category}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Prescription Required</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="all"
                        name="prescription"
                        className="mr-2"
                        checked={prescriptionFilter === null}
                        onChange={() => setPrescriptionFilter(null)}
                      />
                      <label htmlFor="all">All Medicines</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="prescription"
                        name="prescription"
                        className="mr-2"
                        checked={prescriptionFilter === "prescription"}
                        onChange={() => setPrescriptionFilter("prescription")}
                      />
                      <label htmlFor="prescription">Prescription Required</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="otc"
                        name="prescription"
                        className="mr-2"
                        checked={prescriptionFilter === "otc"}
                        onChange={() => setPrescriptionFilter("otc")}
                      />
                      <label htmlFor="otc">OTC Medicines</label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      className="w-1/2"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      className="w-1/2"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                    />
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for medicines..."
              className="pl-10 pr-4 py-6 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="prescription">Prescription</TabsTrigger>
              <TabsTrigger value="otc">OTC</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Products Grid */}
          {filteredMedicines.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium">No medicines found matching your filters</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  isInCart={isInCart(medicine.id)}
                  onAddToCart={() => handleAddToCart(medicine)}
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
      </div>
    </div>
  )
}

function MedicineCard({
  medicine,
  isInCart,
  onAddToCart,
}: {
  medicine: any
  isInCart: boolean
  onAddToCart: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 flex justify-center bg-muted">
          <img src={medicine.image || "/placeholder.svg"} alt={medicine.name} className="h-32 object-contain" />
        </div>
        <div className="p-4">
          <div className="text-xs text-muted-foreground mb-1">{medicine.category}</div>
          <h3 className="font-semibold mb-1">{medicine.name}</h3>
          <div className="text-sm text-muted-foreground mb-2">{medicine.description}</div>
          {medicine.prescriptionRequired && (
            <div className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-0.5 rounded inline-block mb-2">
              Prescription Required
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="font-semibold">₹{medicine.price}</div>
            <Button size="sm" onClick={onAddToCart} disabled={isInCart} variant={isInCart ? "outline" : "default"}>
              {isInCart ? (
                <>
                  <Check className="mr-1 h-4 w-4" /> Added
                </>
              ) : (
                <>
                  <Plus className="mr-1 h-4 w-4" /> Add
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

