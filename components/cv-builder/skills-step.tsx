"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface SkillsStepProps {
  data: string[]
  onUpdate: (data: string[]) => void
}

export default function SkillsStep({ data, onUpdate }: SkillsStepProps) {
  const [inputValue, setInputValue] = useState("")

  const addSkill = () => {
    if (inputValue.trim() && !data.includes(inputValue.trim())) {
      onUpdate([...data, inputValue.trim()])
      setInputValue("")
    }
  }

  const removeSkill = (skill: string) => {
    onUpdate(data.filter((s) => s !== skill))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="skill">Add Skills</Label>
        <div className="flex gap-2">
          <Input
            id="skill"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., JavaScript, Project Management"
          />
          <Button onClick={addSkill} type="button">
            Add
          </Button>
        </div>
      </div>

      {data.length > 0 && (
        <div className="space-y-2">
          <Label>Your Skills</Label>
          <div className="flex flex-wrap gap-2">
            {data.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-2 text-sm">
                {skill}
                <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-600">
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
