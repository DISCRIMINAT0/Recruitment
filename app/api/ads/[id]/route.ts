import { getCurrentUser, getUserProfile } from "@/lib/auth/user-service"
import { getSupabaseServer } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userProfile = await getUserProfile(user.id)
    if (userProfile.role !== "company") {
      return NextResponse.json({ error: "Only companies can delete ads" }, { status: 403 })
    }

    const supabase = await getSupabaseServer()

    // Get company profile
    const { data: company, error: companyError } = await supabase
      .from("company_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (companyError || !company) {
      return NextResponse.json({ error: "Company profile not found" }, { status: 404 })
    }

    // Verify ad ownership
    const { data: ad, error: fetchError } = await supabase
      .from("advertisements")
      .select("company_id")
      .eq("id", id)
      .single()

    if (fetchError || !ad || ad.company_id !== company.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete ad
    const { error: deleteError } = await supabase.from("advertisements").delete().eq("id", id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ad delete error:", error)
    return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 })
  }
}
