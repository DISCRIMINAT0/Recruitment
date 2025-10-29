import { getSupabaseServer } from "@/lib/supabase/server"
import { getSupabaseServiceClient } from "@/lib/supabase/service-client"

export type UserRole = "applicant" | "admin" | "company"

export async function getCurrentUser() {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  const supabase = await getSupabaseServer()
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

export async function createUserProfile(userId: string, email: string, role: UserRole, fullName?: string) {
  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from("users")
    .insert({
      id: userId,
      email,
      role,
      full_name: fullName,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createApplicantProfile(userId: string) {
  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from("applicant_profiles")
    .insert({
      user_id: userId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createCompanyProfile(userId: string, companyName: string) {
  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from("company_profiles")
    .insert({
      user_id: userId,
      company_name: companyName,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
