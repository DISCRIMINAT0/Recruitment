import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/user-service"
import { getSupabaseServer } from "@/lib/supabase/server"
import CVPreview from "@/components/cv/cv-preview"

export default async function CVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const supabase = await getSupabaseServer()
  const { data: cv, error } = await supabase.from("cvs").select("*").eq("id", id).single()

  if (error || !cv) {
    notFound()
  }

  // Check authorization
  if (cv.user_id !== user.id && cv.status !== "published") {
    notFound()
  }

  return <CVPreview cv={cv} isOwner={cv.user_id === user.id} />
}
