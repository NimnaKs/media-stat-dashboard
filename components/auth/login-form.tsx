"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("https://ott-auth.rumex.lk/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Id": "100101118",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      const data = await response.json()
      localStorage.setItem("authToken", data.tokens.accessToken)
      localStorage.setItem("tenantId", "100101118")
      localStorage.setItem("userEmail", email)

      router.push("/dashboard")
    } catch (err) {
      setError("Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img src="/rumex-logo.jpg" alt="Rumex Logo" className="h-16 w-auto" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Rumex OTT Dashboard</h1>
            <p className="text-muted">Tenant Media Statistics</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded border border-border bg-background text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded border border-border bg-background text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
