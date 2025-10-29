"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Eye, Trash2 } from "lucide-react"

interface CV {
  id: string
  title: string
  status: string
  created_at: string
  updated_at: string
}

export default function ApplicantDashboard({ userId }: { userId: string }) {
  const [cvs, setCVs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await fetch("/api/cv/list")
        if (!response.ok) throw new Error("Failed to fetch CVs")
        const data = await response.json()
        setCVs(data.cvs)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchCVs()
  }, [])

  const handleDeleteCV = async (cvId: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return

    try {
      const response = await fetch(`/api/cv/${cvId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete CV")
      setCVs(cvs.filter((cv) => cv.id !== cvId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My CVs</h1>
            <p className="text-gray-600 mt-2">Manage and share your CVs</p>
          </div>
          <Link href="/dashboard/cv-builder">
            <Button className="gap-2">
              <Plus size={20} />
              Create New CV
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total CVs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cvs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cvs.filter((cv) => cv.status === "published").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Profile Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* CVs List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your CVs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : cvs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No CVs yet</h3>
              <p className="text-gray-600 mb-4">Create your first CV to get started</p>
              <Link href="/dashboard/cv-builder">
                <Button>Create CV</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvs.map((cv) => (
              <Card key={cv.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{cv.title}</CardTitle>
                      <CardDescription>Updated {new Date(cv.updated_at).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge variant={cv.status === "published" ? "default" : "secondary"}>{cv.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/cv/${cv.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                        <Eye size={16} />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                      onClick={() => handleDeleteCV(cv.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
