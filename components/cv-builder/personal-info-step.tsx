"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PersonalInfoStepProps {
  data: {
    fullName: string
    email: string
    phone: string
    location: string
    headline: string
    summary: string
  }
  onUpdate: (data: PersonalInfoStepProps["data"]) => void
}

export default function PersonalInfoStep({ data, onUpdate }: PersonalInfoStepProps) {
  const handleChange = (field: string, value: string) => {
    onUpdate({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={data.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="New York, NY"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="headline">Professional Headline</Label>
        <Input
          id="headline"
          value={data.headline}
          onChange={(e) => handleChange("headline", e.target.value)}
          placeholder="e.g., Senior Software Engineer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={data.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          placeholder="Write a brief summary about yourself..."
          rows={4}
        />
      </div>
    </div>
  )
}
