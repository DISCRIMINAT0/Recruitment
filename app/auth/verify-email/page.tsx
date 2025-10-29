import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>Check your inbox for a confirmation link</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          We've sent a confirmation email to your inbox. Click the link in the email to verify your account and get
          started.
        </p>
        <Link href="/" className="block">
          <Button variant="outline" className="w-full bg-transparent">
            Back to Home
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
