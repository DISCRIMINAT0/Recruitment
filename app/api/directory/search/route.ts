import { getSupabaseServer } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const location = searchParams.get("location") || ""
    const minExperience = Number.parseInt(searchParams.get("minExperience") || "0")
    const skills = searchParams.get("skills") || ""

    const supabase = await getSupabaseServer()

    // Get published CVs with applicant profiles and user data
    const { data: cvs, error } = await supabase
      .from("cvs")
      .select("id, content, user_id, status")
      .eq("status", "published")

    if (error) throw error

    // Get applicant profiles for these users
    const userIds = cvs.map((cv) => cv.user_id)
    const { data: profiles, error: profileError } = await supabase
      .from("applicant_profiles")
      .select("id, user_id, location, years_experience")
      .in("user_id", userIds)

    if (profileError) throw profileError

    // Get user data
    const { data: users, error: userError } = await supabase.from("users").select("id, full_name").in("id", userIds)

    if (userError) throw userError

    // Create lookup maps
    const profileMap = new Map(profiles.map((p) => [p.user_id, p]))
    const userMap = new Map(users.map((u) => [u.id, u]))

    // Filter and map results
    const results = cvs
      .filter((cv) => {
        const profile = profileMap.get(cv.user_id)
        if (!profile) return false

        // Search filter
        if (search) {
          const searchLower = search.toLowerCase()
          const fullName = cv.content?.personal?.fullName?.toLowerCase() || ""
          const cvSkills = cv.content?.skills?.join(" ").toLowerCase() || ""
          if (!fullName.includes(searchLower) && !cvSkills.includes(searchLower)) {
            return false
          }
        }

        // Location filter
        if (location && profile.location?.toLowerCase() !== location.toLowerCase()) {
          return false
        }

        // Experience filter
        if (profile.years_experience < minExperience) {
          return false
        }

        // Skills filter
        if (skills) {
          const requiredSkills = skills.split(",").map((s) => s.trim().toLowerCase())
          const applicantSkills = cv.content?.skills?.map((s: string) => s.toLowerCase()) || []
          if (!requiredSkills.some((skill) => applicantSkills.includes(skill))) {
            return false
          }
        }

        return true
      })
      .map((cv) => {
        const profile = profileMap.get(cv.user_id)
        const user = userMap.get(cv.user_id)
        return {
          id: profile?.id,
          fullName: user?.full_name || "Unknown",
          headline: cv.content?.personal?.headline || "",
          location: profile?.location || "",
          yearsExperience: profile?.years_experience || 0,
          skills: cv.content?.skills || [],
          cvId: cv.id,
          bookmarked: false,
        }
      })

    return NextResponse.json({ applicants: results })
  } catch (error) {
    console.error("Directory search error:", error)
    return NextResponse.json({ error: "Failed to search applicants" }, { status: 500 })
  }
}
