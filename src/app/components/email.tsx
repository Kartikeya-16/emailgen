"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function EmailForm() {
  const [recipientName, setRecipientName] = useState("")
  const [emailPurpose, setEmailPurpose] = useState("")
  const [keyPoints, setKeyPoints] = useState("")
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setGeneratedEmail("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/emailgen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipientName, emailPurpose, keyPoints }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate email")
      }

      setGeneratedEmail(data.email)
    } catch (err) {
      setError("An error occurred while generating the email. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="recipientName">Recipient Name</Label>
          <Input id="recipientName" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="emailPurpose">Email Purpose</Label>
          <Select value={emailPurpose} onValueChange={setEmailPurpose} required>
            <SelectTrigger>
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Meeting Request">Meeting Request</SelectItem>
              <SelectItem value="Follow Up">Follow Up</SelectItem>
              <SelectItem value="Thank You">Thank You</SelectItem>
              <SelectItem value="Project Update">Project Update</SelectItem>
              <SelectItem value="Introduction">Introduction</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="keyPoints">Key Points (one per line)</Label>
          <Textarea
            id="keyPoints"
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            placeholder="Enter your key points here, one per line"
            required
            className="min-h-[120px]"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Email"}
        </Button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {generatedEmail && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Generated Email:</h2>
          <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{generatedEmail}</div>
        </div>
      )}
    </div>
  )
}

