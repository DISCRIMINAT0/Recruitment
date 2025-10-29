import { notFound } from "next/navigation"
import { getSupabaseServer } from "@/lib/supabase/server"
import CVPreview from "@/components/cv/cv-preview"

export default async function PublicCVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await getSupabaseServer()

  const { data: cv, error } = await supabase.from("cvs").select("*").eq("id", id).eq("status", "published").single()

  if (error || !cv) {
    notFound()
  }

  return <CVPreview cv={cv} isOwner={false} />
}
