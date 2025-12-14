"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("tenantId")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/movies", label: "Movies", icon: "🎬" },
    { href: "/dashboard/tv-shows", label: "TV Shows", icon: "📺" },
  ]

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-20"} bg-card border-r border-border transition-all duration-300 flex flex-col`}
    >
      <div className="p-6 border-b border-border flex items-center justify-between">
        {isOpen && <img src="/rumex-logo.jpg" alt="Rumex" className="h-25 w-40" />}
        <button onClick={() => setIsOpen(!isOpen)} className="text-muted hover:text-foreground transition">
          ☰
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded transition ${
              pathname === item.href ? "bg-primary text-white" : "text-muted hover:bg-border hover:text-foreground"
            }`}
          >
            <span>{item.icon}</span>
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded text-sm font-medium transition"
        >
          {isOpen ? "Logout" : "↪"}
        </button>
      </div>
    </aside>
  )
}
