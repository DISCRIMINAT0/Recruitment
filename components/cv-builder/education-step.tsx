"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface Education {
  id: string
  school: string
  degree: string
  field: string
  graduationDate: string
  description: string
}

interface EducationStepProps {
  data: Education[]
  onUpdate: (data: Education[]) => void
}

export default function EducationStep({ data, onUpdate }: EducationStepProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      graduationDate: "",
      description: "",
    }
    onUpdate([...data, newEducation])
    setEditingId(newEducation.id)
  }

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onUpdate(data.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu)))
  }

  const removeEducation = (id: string) => {
    onUpdate(data.filter((edu) => edu.id !== id))
  }

  return (
    <div className="space-y-4">
      {data.map((education) => (
        <Card key={education.id} className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{education.degree || "Degree"}</h3>
                <p className="text-gray-600">{education.school || "School"}</p>
              </div>
              <button onClick={() => removeEducation(education.id)} className="text-gray-400 hover:text-red-600">
                <X size={20} />
              </button>
            </div>

            {editingId === education.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>School/University</Label>
                    <Input
                      value={education.school}
                      onChange={(e) => updateEducation(education.id, { school: e.target.value })}
                      placeholder="School name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input
                      value={education.degree}
                      onChange={(e) => updateEducation(education.id, { degree: e.target.value })}
                      placeholder="e.g., Bachelor of Science"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Field of Study</Label>
                    <Input
                      value={education.field}
                      onChange={(e) => updateEducation(education.id, { field: e.target.value })}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Graduation Date</Label>
                    <Input
                      type="month"
                      value={education.graduationDate}
                      onChange={(e) => updateEducation(education.id, { graduationDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={education.description}
                    onChange={(e) => updateEducation(education.id, { description: e.target.value })}
                    placeholder="Add any additional details..."
                    rows={3}
                  />
                </div>

                <Button variant="outline" onClick={() => setEditingId(null)} className="w-full">
                  Done
                </Button>
              </div>
            ) : (
              <button onClick={() => setEditingId(education.id)} className="text-blue-600 hover:underline text-sm">
                Edit
              </button>
            )}
          </div>
        </Card>
      ))}

      <Button onClick={addEducation} variant="outline" className="w-full bg-transparent">
        + Add Education
      </Button>
    </div>
  )
}
