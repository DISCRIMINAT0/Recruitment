"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseClient } from "@/lib/supabase/client"

type UserRole = "applicant" | "company"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = getSupabaseClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole>((searchParams.get("role") as UserRole) || "applicant")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    companyName: "",
  })

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!formData.email || !formData.password || !formData.fullName) {
        throw new Error("Please fill in all required fields")
      }

      if (role === "company" && !formData.companyName) {
        throw new Error("Company name is required")
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          companyName: role === "company" ? formData.companyName : null,
          role,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to sign up")
      }

      const data = await response.json()
      router.push("/auth/verify-email")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join CVHub to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label>I am a</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="applicant"
                  checked={role === "applicant"}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Job Seeker</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="company"
                  checked={role === "company"}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Company</span>
              </label>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          {/* Company Name (if company) */}
          {role === "company" && (
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Your Company"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>
          )}

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
