import { Link } from "react-router-dom"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0 w-full">
      <div className="w-full flex flex-col items-center justify-between gap-4 px-4 md:px-6 lg:px-8 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <Logo showText={false} />
          <p className="text-sm leading-loose text-center md:text-left">
            LightNote &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
        <div className="flex items-center">
          <nav className="flex items-center gap-4 text-sm">
            <a 
              href="https://github.com" 
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              GitHub
            </a>
            <Link 
              to="/terms"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Terms
            </Link>
            <Link 
              to="/privacy"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
} 