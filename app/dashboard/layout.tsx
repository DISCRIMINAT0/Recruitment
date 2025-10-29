import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/user-service"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, Home, Users } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const handleLogout = async () => {
    "use server"
    const { createServerClient } = await import("@supabase/ssr")
    const { cookies } = await import("next/headers")

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // Handle cookie setting errors
            }
          },
        },
      },
    )

    await supabase.auth.signOut()
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            CVHub
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Home size={20} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link href="/directory" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Users size={20} />
              <span className="hidden sm:inline">Directory</span>
            </Link>
            <form action={handleLogout}>
              <Button variant="outline" className="gap-2 bg-transparent">
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}
    </div>
  )
}
