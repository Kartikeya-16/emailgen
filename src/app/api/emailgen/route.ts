import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set in environment variables")
    }

    const { recipientName, emailPurpose, keyPoints } = await req.json()

    const model = new ChatOpenAI({
      temperature: 0.7,
      modelName: "gpt-3.5-turbo",
      openAIApiKey: process.env.OPENAI_API_KEY,
      maxRetries: 3,
    })

    const template = `
    Write a professional email to {recipientName} for the purpose of {emailPurpose}.
    Include the following key points:
    {keyPoints}

    The email should be concise, polite, and well-structured.
    Provide the email in the following format:
    Subject: [Email Subject]

    [Email Body]
    `

    const prompt = PromptTemplate.fromTemplate(template)
    const chain = RunnableSequence.from([prompt, model])

    const result = await chain.invoke({
      recipientName,
      emailPurpose,
      keyPoints,
    })

    return new Response(JSON.stringify({ email: result.content }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error generating email:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to generate email. Please try again later.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

