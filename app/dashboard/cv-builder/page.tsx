"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PersonalInfoStep from "@/components/cv-builder/personal-info-step"
import ExperienceStep from "@/components/cv-builder/experience-step"
import EducationStep from "@/components/cv-builder/education-step"
import SkillsStep from "@/components/cv-builder/skills-step"
import ReviewStep from "@/components/cv-builder/review-step"

type CVStep = "personal" | "experience" | "education" | "skills" | "review"

interface CVData {
  title: string
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

const STEPS: CVStep[] = ["personal", "experience", "education", "skills", "review"]

export default function CVBuilderPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<CVStep>("personal")
  const [cvData, setCVData] = useState<CVData>({
    title: "My CV",
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      headline: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentStepIndex = STEPS.indexOf(currentStep)

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1])
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1])
    }
  }

  const handleSaveCV = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/cv/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cvData),
      })

      if (!response.ok) throw new Error("Failed to save CV")

      const { cvId } = await response.json()
      router.push(`/dashboard/cv/${cvId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const updateCVData = (updates: Partial<CVData>) => {
    setCVData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Build Your CV</h1>
          <p className="text-gray-600 mt-2">
            Step {currentStepIndex + 1} of {STEPS.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex gap-2">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  index <= currentStepIndex ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {currentStep === "personal" && "Personal Information"}
              {currentStep === "experience" && "Work Experience"}
              {currentStep === "education" && "Education"}
              {currentStep === "skills" && "Skills"}
              {currentStep === "review" && "Review Your CV"}
            </CardTitle>
            <CardDescription>
              {currentStep === "personal" && "Tell us about yourself"}
              {currentStep === "experience" && "Add your work experience"}
              {currentStep === "education" && "Add your education"}
              {currentStep === "skills" && "List your key skills"}
              {currentStep === "review" && "Review and submit your CV"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === "personal" && (
              <PersonalInfoStep data={cvData.personal} onUpdate={(personal) => updateCVData({ personal })} />
            )}
            {currentStep === "experience" && (
              <ExperienceStep data={cvData.experience} onUpdate={(experience) => updateCVData({ experience })} />
            )}
            {currentStep === "education" && (
              <EducationStep data={cvData.education} onUpdate={(education) => updateCVData({ education })} />
            )}
            {currentStep === "skills" && (
              <SkillsStep data={cvData.skills} onUpdate={(skills) => updateCVData({ skills })} />
            )}
            {currentStep === "review" && <ReviewStep data={cvData} />}

            {error && <div className="text-sm text-red-600 mt-4">{error}</div>}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="px-8 bg-transparent"
          >
            Previous
          </Button>

          {currentStep === "review" ? (
            <Button onClick={handleSaveCV} disabled={loading} className="px-8 bg-green-600 hover:bg-green-700">
              {loading ? "Saving..." : "Save & Publish CV"}
            </Button>
          ) : (
            <Button onClick={handleNext} className="px-8">
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
