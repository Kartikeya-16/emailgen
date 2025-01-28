import EmailForm from "./components/email"

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Professional Email Generator</h1>
      <p className="mb-4">
        Fill out the form below to generate a professional email using AI. Provide the recipient's name, select the
        purpose of the email, and include key points you want to address. The AI will generate a unique, personalized
        email based on your input.
      </p>
      <EmailForm />
    </div>
  )
}

