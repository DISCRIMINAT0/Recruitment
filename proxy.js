import { updateSession } from "@/lib/supabase/middleware"

export default async function proxy(request) {
  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}
