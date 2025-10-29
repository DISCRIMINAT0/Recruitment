import { getCurrentUser, getUserProfile } from "@/lib/auth/user-service"
import { getSupabaseServer } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userProfile = await getUserProfile(user.id)
    if (userProfile.role !== "company") {
      return NextResponse.json({ error: "Only companies can create ads" }, { status: 403 })
    }

    const { title, description, imageUrl, linkUrl, startDate, endDate } = await request.json()
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

    // Create advertisement
    const { data: ad, error: adError } = await supabase
      .from("advertisements")
      .insert({
        company_id: company.id,
        title,
        description,
        image_url: imageUrl,
        link_url: linkUrl,
        start_date: startDate ? new Date(startDate).toISOString() : null,
        end_date: endDate ? new Date(endDate).toISOString() : null,
        status: "active",
      })
      .select()
      .single()

    if (adError) throw adError

    return NextResponse.json({ adId: ad.id })
  } catch (error) {
    console.error("Ad creation error:", error)
    return NextResponse.json({ error: "Failed to create advertisement" }, { status: 500 })
  }
}
