import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Clock, Pill, Phone, AlertCircle, ArrowRight, Star, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { HeroSection } from "@/components/hero-section"
import { MedicineCategory } from "@/components/medicine-category"
import { SOSButton } from "@/components/sos-button"
import { TrainTracker } from "@/components/train-tracker"
import { CartButton } from "@/components/cart-button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Pill className="h-6 w-6 text-vibrant-blue dark:text-vibrant-purple" />
              <span className="text-xl font-bold">Rail Meds</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/medicines"
              className="text-sm font-medium hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
            >
              Medicines
            </Link>
            <Link
              href="/doctors"
              className="text-sm font-medium hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
            >
              Doctors
            </Link>
            <Link
              href="/emergency"
              className="text-sm font-medium hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
            >
              Emergency
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
            >
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <CartButton />
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-vibrant-blue hover:bg-vibrant-blue/90 dark:bg-vibrant-purple dark:hover:bg-vibrant-purple/90"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-12">
        {/* Hero Section */}
        <HeroSection />

        {/* Services Section - Moved up for better visibility */}
        <section className="py-4" id="services">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare solutions designed specifically for railway passengers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/medicines" className="block">
              <div className="service-card h-full rounded-xl overflow-hidden shadow-lg border border-border hover:border-vibrant-blue dark:hover:border-vibrant-purple transition-all">
                <div className="bg-gradient-blue-purple p-6 flex justify-center">
                  <Pill className="h-12 w-12 text-white" />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold">Medicine Delivery</h3>
                  <p className="text-muted-foreground">
                    Get medicines delivered directly to your seat or at the next station
                  </p>
                  <div className="flex items-center text-vibrant-blue dark:text-vibrant-purple">
                    <span>Order Now</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/doctors" className="block">
              <div className="service-card h-full rounded-xl overflow-hidden shadow-lg border border-border hover:border-vibrant-pink dark:hover:border-vibrant-pink transition-all">
                <div className="bg-gradient-pink-orange p-6 flex justify-center">
                  <Phone className="h-12 w-12 text-white" />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold">Doctor Consultation</h3>
                  <p className="text-muted-foreground">Connect with certified doctors via video/audio call anytime</p>
                  <div className="flex items-center text-vibrant-pink dark:text-vibrant-pink">
                    <span>Consult Now</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/emergency" className="block">
              <div className="service-card h-full rounded-xl overflow-hidden shadow-lg border border-border hover:border-vibrant-red dark:hover:border-vibrant-red transition-all">
                <div className="bg-gradient-yellow-orange p-6 flex justify-center">
                  <AlertCircle className="h-12 w-12 text-white" />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold">Emergency Assistance</h3>
                  <p className="text-muted-foreground">Request immediate medical help during your journey</p>
                  <div className="flex items-center text-vibrant-red dark:text-vibrant-red">
                    <span>Get Help</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/services">
              <Button className="bg-vibrant-blue hover:bg-vibrant-blue/90 dark:bg-vibrant-purple dark:hover:bg-vibrant-purple/90">
                View All Services
              </Button>
            </Link>
          </div>
        </section>

        {/* Train Tracker */}
        <section className="py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-2/3">
              <TrainTracker />
            </div>
            <div className="w-full md:w-1/3">
              <SOSButton />
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="py-4">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for medicines, health products..."
              className="pl-10 pr-4 py-6 rounded-lg border-vibrant-blue/20 dark:border-vibrant-purple/20 focus:border-vibrant-blue dark:focus:border-vibrant-purple"
            />
            <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-vibrant-blue hover:bg-vibrant-blue/90 dark:bg-vibrant-purple dark:hover:bg-vibrant-purple/90">
              Search
            </Button>
          </div>
        </section>

        {/* Medicine Categories */}
        <section className="py-4">
          <h2 className="text-2xl font-bold mb-4">Medicine Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MedicineCategory
              icon="/placeholder.svg?height=80&width=80"
              title="Fever & Pain Relief"
              link="/medicines/fever-pain"
            />
            <MedicineCategory
              icon="/placeholder.svg?height=80&width=80"
              title="Stomach Care"
              link="/medicines/stomach-care"
            />
            <MedicineCategory
              icon="/placeholder.svg?height=80&width=80"
              title="First Aid"
              link="/medicines/first-aid"
            />
            <MedicineCategory
              icon="/placeholder.svg?height=80&width=80"
              title="Diabetes Care"
              link="/medicines/diabetes"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8 bg-gradient-to-r from-vibrant-blue/10 to-vibrant-purple/10 dark:from-vibrant-blue/5 dark:to-vibrant-purple/5 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Rail Meds</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-vibrant-blue/20 dark:bg-vibrant-blue/10 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8 text-vibrant-blue dark:text-vibrant-purple" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick Delivery</h3>
              <p className="text-muted-foreground">Medicines delivered at your seat or next station within minutes</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-vibrant-pink/20 dark:bg-vibrant-pink/10 p-4 rounded-full mb-4">
                <Star className="h-8 w-8 text-vibrant-pink" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Certified Doctors</h3>
              <p className="text-muted-foreground">Consult with qualified healthcare professionals 24/7</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-vibrant-green/20 dark:bg-vibrant-green/10 p-4 rounded-full mb-4">
                <Shield className="h-8 w-8 text-vibrant-green" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Medicines</h3>
              <p className="text-muted-foreground">
                All medicines are genuine and sourced from authorized distributors
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6 text-center">How Rail Meds Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="bg-vibrant-blue/10 dark:bg-vibrant-blue/5 p-4 rounded-full mb-4">
                  <MapPin className="h-8 w-8 text-vibrant-blue dark:text-vibrant-purple" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Enter PNR Details</h3>
                <p className="text-muted-foreground">We track your train location to determine delivery options</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="bg-vibrant-pink/10 dark:bg-vibrant-pink/5 p-4 rounded-full mb-4">
                  <Pill className="h-8 w-8 text-vibrant-pink" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Order Medicines</h3>
                <p className="text-muted-foreground">
                  Browse and order from our wide range of medicines and health products
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="bg-vibrant-green/10 dark:bg-vibrant-green/5 p-4 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-vibrant-green" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Get Timely Delivery</h3>
                <p className="text-muted-foreground">Receive your order at your seat or at the next major station</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8">
          <div className="bg-gradient-blue-purple dark:bg-gradient-blue-purple rounded-xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Ready to experience hassle-free medical assistance?</h2>
                <p className="text-white/80">Sign up now and get 10% off on your first order</p>
              </div>
              <div className="flex gap-4">
                <Link href="/signup">
                  <Button className="bg-white text-vibrant-blue hover:bg-white/90">Sign Up Now</Button>
                </Link>
                <Link href="/medicines">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    Browse Medicines
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Pill className="h-6 w-6 text-vibrant-blue dark:text-vibrant-purple" />
                <span className="text-xl font-bold">Rail Meds</span>
              </div>
              <p className="text-muted-foreground">Medical assistance and medicine delivery for railway passengers</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/medicines"
                    className="text-muted-foreground hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
                  >
                    Medicine Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/doctors"
                    className="text-muted-foreground hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
                  >
                    Doctor Consultation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/emergency"
                    className="text-muted-foreground hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
                  >
                    Emergency Assistance
                  </Link>
                </li>
                <li>
                  <Link
                    href="/symptom-checker"
                    className="text-muted-foreground hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
                  >
                    Symptom Checker
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-muted-foreground hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/partners"
                    className="text-muted-foreground hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
                  >
                    Partner With Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/refund"
                    className="text-muted-foreground hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
                  >
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-muted-foreground hover:text-vibrant-blue dark:hover:text-vibrant-purple transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Rail Meds. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

