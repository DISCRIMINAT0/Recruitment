"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Briefcase, Bookmark, BookmarkCheck } from "lucide-react"

interface Applicant {
  id: string
  fullName: string
  headline: string
  location: string
  yearsExperience: number
  skills: string[]
  cvId: string
  bookmarked: boolean
}

export default function DirectoryPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    location: "",
    minExperience: 0,
    skills: "",
  })

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const params = new URLSearchParams({
          search: searchQuery,
          location: filters.location,
          minExperience: filters.minExperience.toString(),
          skills: filters.skills,
        })

        const response = await fetch(`/api/directory/search?${params}`)
        if (!response.ok) throw new Error("Failed to fetch applicants")
        const data = await response.json()
        setApplicants(data.applicants)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchApplicants, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, filters])

  const handleBookmark = async (applicantId: string, isBookmarked: boolean) => {
    try {
      const response = await fetch("/api/bookmarks/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId, isBookmarked: !isBookmarked }),
      })

      if (!response.ok) throw new Error("Failed to toggle bookmark")

      setApplicants(applicants.map((app) => (app.id === applicantId ? { ...app, bookmarked: !isBookmarked } : app)))
    } catch (err) {
      console.error("Bookmark error:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applicant Directory</h1>
          <p className="text-gray-600 mt-2">Browse and connect with talented professionals</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search by name or skills</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <Input
                    id="search"
                    placeholder="Search applicants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., New York, NY"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Minimum Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={filters.minExperience}
                    onChange={(e) => setFilters({ ...filters, minExperience: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., JavaScript, React"
                    value={filters.skills}
                    onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading applicants...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : applicants.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No applicants found</h3>
              <p className="text-gray-600">Try adjusting your search filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applicants.map((applicant) => (
              <Card key={applicant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{applicant.fullName}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{applicant.headline}</p>
                    </div>
                    <button
                      onClick={() => handleBookmark(applicant.id, applicant.bookmarked)}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      {applicant.bookmarked ? (
                        <BookmarkCheck size={20} className="text-blue-600" />
                      ) : (
                        <Bookmark size={20} />
                      )}
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    {applicant.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {applicant.location}
                      </div>
                    )}
                    {applicant.yearsExperience > 0 && (
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        {applicant.yearsExperience} years experience
                      </div>
                    )}
                  </div>

                  {applicant.skills.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-600">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {applicant.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {applicant.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{applicant.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Link href={`/cv/${applicant.cvId}`} className="block">
                    <Button variant="outline" className="w-full bg-transparent">
                      View CV
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
