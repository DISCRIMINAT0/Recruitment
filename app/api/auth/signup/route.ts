import { getSupabaseServiceClient } from "@/lib/supabase/service-client"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, companyName, role } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabaseService = getSupabaseServiceClient()

    // Sign up user
    const { data: authData, error: authError } = await supabaseService.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    })

    if (authError) throw authError

    if (!authData.user) {
      throw new Error("Failed to create user")
    }

    // Create user profile
    const { error: userError } = await supabaseService.from("users").insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role,
    })

    if (userError) throw userError

    // Create role-specific profile
    if (role === "applicant") {
      const { error: profileError } = await supabaseService.from("applicant_profiles").insert({
        user_id: authData.user.id,
      })
      if (profileError) throw profileError
    } else if (role === "company") {
      const { error: companyError } = await supabaseService.from("company_profiles").insert({
        user_id: authData.user.id,
        company_name: companyName,
      })
      if (companyError) throw companyError
    }

    return NextResponse.json({ success: true, userId: authData.user.id })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to sign up" }, { status: 500 })
  }
}
