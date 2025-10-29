import { getCurrentUser } from "@/lib/auth/user-service"
import { getSupabaseServer } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cvData = await request.json()
    const supabase = await getSupabaseServer()

    // Create CV
    const { data: cv, error: cvError } = await supabase
      .from("cvs")
      .insert({
        user_id: user.id,
        title: cvData.title,
        status: "published",
        content: cvData,
      })
      .select()
      .single()

    if (cvError) throw cvError

    // Create CV sections
    const sections = [
      { section_type: "personal", content: cvData.personal, order_index: 0 },
      { section_type: "experience", content: cvData.experience, order_index: 1 },
      { section_type: "education", content: cvData.education, order_index: 2 },
      { section_type: "skills", content: cvData.skills, order_index: 3 },
    ]

    for (const section of sections) {
      await supabase.from("cv_sections").insert({
        cv_id: cv.id,
        ...section,
      })
    }

    return NextResponse.json({ cvId: cv.id })
  } catch (error) {
    console.error("CV creation error:", error)
    return NextResponse.json({ error: "Failed to create CV" }, { status: 500 })
  }
}
