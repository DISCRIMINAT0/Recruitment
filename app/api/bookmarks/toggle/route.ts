import { getCurrentUser } from "@/lib/auth/user-service"
import { getSupabaseServer } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { applicantId, isBookmarked } = await request.json()
    const supabase = await getSupabaseServer()

    if (isBookmarked) {
      // Remove bookmark
      const { error } = await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("cv_id", applicantId)

      if (error) throw error
    } else {
      // Add bookmark
      const { error } = await supabase.from("bookmarks").insert({
        user_id: user.id,
        cv_id: applicantId,
      })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Bookmark toggle error:", error)
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 })
  }
}
