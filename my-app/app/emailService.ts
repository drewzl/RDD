"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function formatPTTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  }).format(date)
}

export async function sendEmailAlert(status: string, comments: string) {
  const currentTime = formatPTTime(new Date())

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["drew@thelaundrysf.com"],
      subject: "Roblox Status Alert",
      html: `
        <h1>Roblox Status Alert</h1>
        <p>Current status: Roblox has ${status}</p>
        <p>Time of check: ${currentTime}</p>
        <br/>
        <h2>Community Feedback</h2>
        <pre style="white-space: pre-wrap; font-family: sans-serif;">${comments}</pre>
      `,
    })

    if (error) {
      console.error("Failed to send email:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

