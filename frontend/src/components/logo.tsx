import { PencilLine } from "lucide-react"
import { Link } from "react-router-dom"

interface LogoProps {
  showText?: boolean
  className?: string
}

export function Logo({ showText = true, className = "" }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center space-x-2 ${className}`}>
      <PencilLine className="h-6 w-6 text-foreground" />
      {showText && (
        <span className="font-bold">
          LightNote
        </span>
      )}
    </Link>
  )
} 