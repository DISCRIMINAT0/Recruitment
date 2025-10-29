"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Edit, Share2, ArrowLeft } from "lucide-react"

interface CVData {
  id: string
  title: string
  status: string
  content: {
    personal: {
      fullName: string
      email: string
      phone: string
      location: string
      headline: string
      summary: string
    }
    experience: Array<{
      id: string
      company: string
      position: string
      startDate: string
      endDate: string
      currentlyWorking: boolean
      description: string
    }>
    education: Array<{
      id: string
      school: string
      degree: string
      field: string
      graduationDate: string
      description: string
    }>
    skills: string[]
  }
}

export default function CVPreview({ cv, isOwner }: { cv: CVData; isOwner: boolean }) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const url = `${window.location.origin}/cv/${cv.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/cv/${cv.id}/pdf`)
      if (!response.ok) throw new Error("Failed to generate PDF")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${cv.content.personal.fullName}-CV.pdf`
      a.click()
    } catch (error) {
      console.error("PDF download error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft size={16} />
              Back
            </Button>
          </Link>
          {isOwner && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleDownloadPDF}>
                <Download size={16} />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleShare}>
                <Share2 size={16} />
                {copied ? "Copied!" : "Share"}
              </Button>
              <Link href={`/dashboard/cv/${cv.id}/edit`}>
                <Button size="sm" className="gap-2">
                  <Edit size={16} />
                  Edit
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* CV Content */}
        <Card className="bg-white">
          <CardContent className="p-8">
            {/* Personal Info */}
            <div className="mb-8 pb-8 border-b">
              <h1 className="text-4xl font-bold text-gray-900">{cv.content.personal.fullName}</h1>
              <p className="text-xl text-blue-600 mt-2">{cv.content.personal.headline}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                {cv.content.personal.email && <span>{cv.content.personal.email}</span>}
                {cv.content.personal.phone && <span>{cv.content.personal.phone}</span>}
                {cv.content.personal.location && <span>{cv.content.personal.location}</span>}
              </div>
              {cv.content.personal.summary && (
                <p className="text-gray-700 mt-4 leading-relaxed">{cv.content.personal.summary}</p>
              )}
            </div>

            {/* Experience */}
            {cv.content.experience.length > 0 && (
              <div className="mb-8 pb-8 border-b">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Work Experience</h2>
                <div className="space-y-6">
                  {cv.content.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
                        </span>
                      </div>
                      {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cv.content.education.length > 0 && (
              <div className="mb-8 pb-8 border-b">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
                <div className="space-y-6">
                  {cv.content.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.school}</p>
                          <p className="text-sm text-gray-500">{edu.field}</p>
                        </div>
                        <span className="text-sm text-gray-500">{edu.graduationDate}</span>
                      </div>
                      {edu.description && <p className="text-gray-700 mt-2">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {cv.content.skills.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {cv.content.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
