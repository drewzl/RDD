import { sendEmailAlert } from "./emailService"

async function scrapeComments(html: string) {
  try {
    const commentsStart = html.indexOf('class="comments-list"')
    if (commentsStart === -1) return "No comments found"

    const relevantSection = html.slice(commentsStart, commentsStart + 5000)
    const comments = relevantSection.match(/<p[^>]*>(.*?)<\/p>/g) || []

    const commentTexts = comments
      .slice(0, 10)
      .map((comment) => {
        return comment
          .replace(/<[^>]*>/g, "")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .trim()
      })
      .filter((text) => text.length > 0)

    return commentTexts.length > 0
      ? "Recent user comments:\n\n" + commentTexts.join("\n\n")
      : "No recent comments found"
  } catch (error) {
    console.error("Error scraping comments:", error)
    return "Unable to fetch recent comments"
  }
}

export async function checkRobloxStatus() {
  try {
    const response = await fetch("https://downdetector.com/status/roblox/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })
    const text = await response.text()

    const hasProblems = text.includes("User reports indicate problems")
    const status = hasProblems ? "problems" : "no problems"

    let emailResult = null
    if (hasProblems) {
      const comments = await scrapeComments(text)
      emailResult = await sendEmailAlert(status, comments)
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      error: null,
      emailResult,
    }
  } catch (error) {
    console.error("Error checking Roblox status:", error)
    return {
      status: "unknown",
      timestamp: new Date().toISOString(),
      error: "Failed to fetch Roblox status",
      emailResult: null,
    }
  }
}

