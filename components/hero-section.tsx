import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-vibrant-blue to-vibrant-purple dark:from-vibrant-purple dark:to-vibrant-blue bg-clip-text text-transparent">
            Medical Assistance for Your Railway Journey
          </h1>
          <p className="text-xl text-muted-foreground">
            Get medicines delivered to your seat or consult with doctors during your train journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/medicines">
              <Button
                size="lg"
                className="px-8 bg-vibrant-blue hover:bg-vibrant-blue/90 dark:bg-vibrant-purple dark:hover:bg-vibrant-purple/90 animate-pulse-scale"
              >
                Order Medicines
              </Button>
            </Link>
            <Link href="/doctors">
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-vibrant-blue text-vibrant-blue hover:bg-vibrant-blue/10 dark:border-vibrant-purple dark:text-vibrant-purple dark:hover:bg-vibrant-purple/10"
              >
                Consult Doctor
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-vibrant-green"></span>
              <span>500+ Stations</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-vibrant-green"></span>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-vibrant-green"></span>
              <span>Certified Doctors</span>
            </div>
          </div>
        </div>
        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
          <img
            src="https://dflwdqtpiynravjyvzyn.supabase.co/storage/v1/object/public/new//cebac80c-d07f-407c-87cb-4958a9806594.png"
            alt="Railway medical assistance"
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="text-white">
              <p className="font-bold">Trusted by 10,000+ travelers</p>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

