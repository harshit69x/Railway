import type React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  link: string
  color: string
  textColor: string
}

export function ServiceCard({ icon, title, description, link, color, textColor }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden service-card transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          <div className={`p-6 ${color}`}>
            <div className={`${textColor}`}>{icon}</div>
          </div>
          <div className="p-6 space-y-2 flex-1">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="p-4 border-t">
            <Link href={link}>
              <Button variant="ghost" className="w-full justify-between group">
                Explore
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

