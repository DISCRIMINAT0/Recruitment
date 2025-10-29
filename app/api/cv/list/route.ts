import { getCurrentUser } from "@/lib/auth/user-service"
import { getSupabaseServer } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServer()
    const { data: cvs, error } = await supabase
      .from("cvs")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ cvs })
  } catch (error) {
    console.error("CV list error:", error)
    return NextResponse.json({ error: "Failed to fetch CVs" }, { status: 500 })
  }
}
