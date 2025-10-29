import { getCurrentUser } from "@/lib/auth/user-service"
import { getSupabaseServer } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServer()

    // Verify ownership
    const { data: cv, error: fetchError } = await supabase.from("cvs").select("user_id").eq("id", id).single()

    if (fetchError || !cv || cv.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete CV
    const { error: deleteError } = await supabase.from("cvs").delete().eq("id", id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("CV delete error:", error)
    return NextResponse.json({ error: "Failed to delete CV" }, { status: 500 })
  }
}
