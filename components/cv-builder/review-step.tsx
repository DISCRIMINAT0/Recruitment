"use client"

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

interface ReviewStepProps {
  data: CVData
}

export default function ReviewStep({ data }: ReviewStepProps) {
  return (
    <div className="space-y-8 max-h-96 overflow-y-auto">
      {/* Personal Info */}
      <div>
        <h3 className="text-lg font-semibold mb-2">{data.personal.fullName}</h3>
        <p className="text-gray-600">{data.personal.headline}</p>
        <div className="text-sm text-gray-500 mt-2 space-y-1">
          {data.personal.email && <p>Email: {data.personal.email}</p>}
          {data.personal.phone && <p>Phone: {data.personal.phone}</p>}
          {data.personal.location && <p>Location: {data.personal.location}</p>}
        </div>
        {data.personal.summary && <p className="text-gray-700 mt-3 text-sm">{data.personal.summary}</p>}
      </div>

      {/* Experience */}
      {data.experience.length > 0 && (
        <div>
          <h4 className="font-semibold text-base mb-3">Work Experience</h4>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-gray-300 pl-4">
                <p className="font-medium">{exp.position}</p>
                <p className="text-sm text-gray-600">{exp.company}</p>
                <p className="text-xs text-gray-500">
                  {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
                </p>
                {exp.description && <p className="text-sm text-gray-700 mt-1">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div>
          <h4 className="font-semibold text-base mb-3">Education</h4>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-gray-300 pl-4">
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm text-gray-600">{edu.school}</p>
                <p className="text-xs text-gray-500">{edu.field}</p>
                {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h4 className="font-semibold text-base mb-3">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
