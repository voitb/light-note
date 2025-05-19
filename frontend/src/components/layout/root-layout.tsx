import { Outlet } from "react-router-dom"
import { Header } from "./header"
import { Footer } from "./footer"

export function RootLayout() {
  return (
    <div className="relative flex flex-col min-h-[100dvh] w-full mx-0 px-0">
      <Header />
      <main className="flex-1 w-full mx-0 px-0 mt-14">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
} 