import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Briefcase, Users, CheckCircle, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">CVHub</div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="bg-transparent">
                Log In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Build Your Professional CV in Minutes
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create a stunning CV, connect with top companies, and land your dream job. All in one platform.
            </p>
            <div className="flex gap-4">
              <Link href="/auth/signup?role=applicant">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight size={20} />
                </Button>
              </Link>
              <Link href="/directory">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Browse Opportunities
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 h-96 flex items-center justify-center">
            <FileText size={120} className="text-blue-300" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose CVHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <FileText className="text-blue-600 mb-4" size={32} />
                <CardTitle>Easy CV Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create a professional CV with our intuitive step-by-step wizard. No design skills needed.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Briefcase className="text-blue-600 mb-4" size={32} />
                <CardTitle>Job Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with top companies actively looking for talent. Get discovered by recruiters.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="text-blue-600 mb-4" size={32} />
                <CardTitle>Networking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Build your professional network and connect with other professionals in your field.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Companies Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-8 h-96 flex items-center justify-center">
              <Briefcase size={120} className="text-green-300" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">For Companies</h2>
              <p className="text-xl text-gray-600 mb-8">
                Find and connect with top talent. Post advertisements, browse CVs, and build your dream team.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Access to thousands of qualified candidates</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Post targeted job advertisements</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Advanced filtering and search capabilities</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Analytics and performance tracking</span>
                </li>
              </ul>
              <Link href="/auth/signup?role=company">
                <Button size="lg" className="gap-2">
                  Post a Job <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-blue-100">Active Job Seekers</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-blue-100">Companies</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <p className="text-blue-100">CVs Created</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <p className="text-blue-100">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals who have already found their dream job on CVHub.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup?role=applicant">
              <Button size="lg" className="gap-2">
                Create Your CV <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/auth/signup?role=company">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                Hire Top Talent <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">CVHub</h3>
              <p className="text-sm">Build your professional CV and connect with top companies.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/dashboard/cv-builder" className="hover:text-white">
                    Build CV
                  </Link>
                </li>
                <li>
                  <Link href="/directory" className="hover:text-white">
                    Browse Jobs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/directory" className="hover:text-white">
                    Find Talent
                  </Link>
                </li>
                <li>
                  <Link href="/auth/dashboard/ads/create" className="hover:text-white">
                    Post Job
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 CVHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
