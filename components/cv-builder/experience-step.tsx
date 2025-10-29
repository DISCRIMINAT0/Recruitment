"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
  description: string
}

interface ExperienceStepProps {
  data: Experience[]
  onUpdate: (data: Experience[]) => void
}

export default function ExperienceStep({ data, onUpdate }: ExperienceStepProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    }
    onUpdate([...data, newExperience])
    setEditingId(newExperience.id)
  }

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onUpdate(data.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)))
  }

  const removeExperience = (id: string) => {
    onUpdate(data.filter((exp) => exp.id !== id))
  }

  return (
    <div className="space-y-4">
      {data.map((experience) => (
        <Card key={experience.id} className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{experience.position || "Position"}</h3>
                <p className="text-gray-600">{experience.company || "Company"}</p>
              </div>
              <button onClick={() => removeExperience(experience.id)} className="text-gray-400 hover:text-red-600">
                <X size={20} />
              </button>
            </div>

            {editingId === experience.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={experience.company}
                      onChange={(e) => updateExperience(experience.id, { company: e.target.value })}
                      placeholder="Company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                      value={experience.position}
                      onChange={(e) => updateExperience(experience.id, { position: e.target.value })}
                      placeholder="Job title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={experience.startDate}
                      onChange={(e) => updateExperience(experience.id, { startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={experience.endDate}
                      onChange={(e) => updateExperience(experience.id, { endDate: e.target.value })}
                      disabled={experience.currentlyWorking}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={experience.currentlyWorking}
                    onChange={(e) => updateExperience(experience.id, { currentlyWorking: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">I currently work here</span>
                </label>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={experience.description}
                    onChange={(e) => updateExperience(experience.id, { description: e.target.value })}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                  />
                </div>

                <Button variant="outline" onClick={() => setEditingId(null)} className="w-full">
                  Done
                </Button>
              </div>
            ) : (
              <button onClick={() => setEditingId(experience.id)} className="text-blue-600 hover:underline text-sm">
                Edit
              </button>
            )}
          </div>
        </Card>
      ))}

      <Button onClick={addExperience} variant="outline" className="w-full bg-transparent">
        + Add Experience
      </Button>
    </div>
  )
}
