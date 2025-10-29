import { getCurrentUser, getUserProfile } from "@/lib/auth/user-service"
import { getSupabaseServer } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userProfile = await getUserProfile(user.id)
    if (userProfile.role !== "company") {
      return NextResponse.json({ error: "Only companies can view ads" }, { status: 403 })
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

    // Get ads
    const { data: ads, error: adsError } = await supabase
      .from("advertisements")
      .select("*")
      .eq("company_id", company.id)
      .order("created_at", { ascending: false })

    if (adsError) throw adsError

    // Calculate stats
    const stats = {
      totalAds: ads.length,
      activeAds: ads.filter((ad) => ad.status === "active").length,
      totalImpressions: ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0),
      totalClicks: ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0),
    }

    return NextResponse.json({ ads, stats })
  } catch (error) {
    console.error("Ads list error:", error)
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 })
  }
}
