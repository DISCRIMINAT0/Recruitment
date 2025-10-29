import { redirect } from "next/navigation"
import { getCurrentUser, getUserProfile } from "@/lib/auth/user-service"
import ApplicantDashboard from "@/components/dashboard/applicant-dashboard"
import CompanyDashboard from "@/components/dashboard/company-dashboard"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const userProfile = await getUserProfile(user.id)

  if (userProfile.role === "applicant") {
    return <ApplicantDashboard userId={user.id} />
  } else if (userProfile.role === "company") {
    return <CompanyDashboard userId={user.id} />
  }

  redirect("/login")
}
