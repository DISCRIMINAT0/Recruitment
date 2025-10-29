"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, BarChart3, Eye, Edit, Trash2 } from "lucide-react"

interface Advertisement {
  id: string
  title: string
  status: string
  impressions: number
  clicks: number
  created_at: string
}

export default function CompanyDashboard({ userId }: { userId: string }) {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({ totalAds: 0, activeAds: 0, totalImpressions: 0, totalClicks: 0 })

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch("/api/ads/list")
        if (!response.ok) throw new Error("Failed to fetch ads")
        const data = await response.json()
        setAds(data.ads)
        setStats(data.stats)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  const handleDeleteAd = async (adId: string) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return

    try {
      const response = await fetch(`/api/ads/${adId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete ad")
      setAds(ads.filter((ad) => ad.id !== adId))
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
            <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your advertisements and reach top talent</p>
          </div>
          <Link href="/dashboard/ads/create">
            <Button className="gap-2">
              <Plus size={20} />
              Create Advertisement
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAds}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAds}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalImpressions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClicks}</div>
            </CardContent>
          </Card>
        </div>

        {/* Ads List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your advertisements...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : ads.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No advertisements yet</h3>
              <p className="text-gray-600 mb-4">Create your first advertisement to reach job seekers</p>
              <Link href="/dashboard/ads/create">
                <Button>Create Advertisement</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {ads.map((ad) => (
              <Card key={ad.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{ad.title}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Eye size={16} />
                          {ad.impressions} impressions
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 size={16} />
                          {ad.clicks} clicks
                        </span>
                      </div>
                    </div>
                    <Badge variant={ad.status === "active" ? "default" : "secondary"}>{ad.status}</Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/dashboard/ads/${ad.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                        <Edit size={16} />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                      onClick={() => handleDeleteAd(ad.id)}
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
