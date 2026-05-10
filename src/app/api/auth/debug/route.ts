import { NextResponse } from "next/server";

export async function GET() {
  const config = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID ? "✓ Set" : "✗ Missing",
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET ? "✓ Set" : "✗ Missing",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✓ Set" : "✗ Missing",
    DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "✗ Missing",
  };

  const allConfigured = 
    process.env.NEXTAUTH_URL &&
    process.env.DISCORD_CLIENT_ID &&
    process.env.DISCORD_CLIENT_SECRET &&
    process.env.NEXTAUTH_SECRET &&
    process.env.DATABASE_URL;

  return NextResponse.json({
    status: allConfigured ? "✓ Auth configured correctly" : "✗ Missing configuration",
    config,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/discord`,
  });
}
