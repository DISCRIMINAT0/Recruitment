import { getCurrentUser } from "@/lib/auth/user-service"
import { getSupabaseServer } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServer()
    const { data: cv, error } = await supabase.from("cvs").select("*").eq("id", id).single()

    if (error || !cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    // Check authorization
    if (cv.user_id !== user.id && cv.status !== "published") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate PDF (placeholder - would use a library like puppeteer or html2pdf)
    const htmlContent = generateHTMLFromCV(cv.content)
    const pdfBuffer = Buffer.from(htmlContent)

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cv.content.personal.fullName}-CV.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

function generateHTMLFromCV(content: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${content.personal.fullName} - CV</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; }
          h2 { color: #666; margin-top: 20px; }
          .section { margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>${content.personal.fullName}</h1>
        <p>${content.personal.headline}</p>
        <p>${content.personal.email} | ${content.personal.phone} | ${content.personal.location}</p>
        <p>${content.personal.summary}</p>
        
        <h2>Work Experience</h2>
        ${content.experience
          .map(
            (exp: any) => `
          <div class="section">
            <strong>${exp.position}</strong> at ${exp.company}
            <p>${exp.startDate} - ${exp.currentlyWorking ? "Present" : exp.endDate}</p>
            <p>${exp.description}</p>
          </div>
        `,
          )
          .join("")}
        
        <h2>Education</h2>
        ${content.education
          .map(
            (edu: any) => `
          <div class="section">
            <strong>${edu.degree}</strong> in ${edu.field}
            <p>${edu.school}</p>
            <p>${edu.graduationDate}</p>
          </div>
        `,
          )
          .join("")}
        
        <h2>Skills</h2>
        <p>${content.skills.join(", ")}</p>
      </body>
    </html>
  `
}
