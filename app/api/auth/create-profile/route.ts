import { createUserProfile, createApplicantProfile, createCompanyProfile } from "@/lib/auth/user-service"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, email, role, fullName, companyName } = await request.json()

    // Create user profile
    await createUserProfile(userId, email, role, fullName)

    // Create role-specific profile
    if (role === "applicant") {
      await createApplicantProfile(userId)
    } else if (role === "company") {
      await createCompanyProfile(userId, companyName)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile creation error:", error)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}
