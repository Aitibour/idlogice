import { NextResponse } from "next/server";

export async function GET() {
  const health = {
    status: "healthy" as const,
    version: process.env.npm_package_version || "0.1.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NEXT_PUBLIC_APP_ENV || "development",
  };

  return NextResponse.json(health);
}
