import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface MedicineCategoryProps {
  icon: string
  title: string
  link: string
}

export function MedicineCategory({ icon, title, link }: MedicineCategoryProps) {
  return (
    <Link href={link}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <img src={icon || "/placeholder.svg"} alt={title} className="w-16 h-16 mb-3" />
          <h3 className="font-medium">{title}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}

