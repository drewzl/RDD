import { NextResponse } from "next/server"
import { checkRobloxStatus } from "@/app/actions"

export async function GET() {
  try {
    const result = await checkRobloxStatus()
    return NextResponse.json({ message: "Cron job executed successfully", result })
  } catch (error) {
    console.error("Cron job failed:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic" 

