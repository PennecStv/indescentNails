import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { readPhoto } from "@/lib/upload";

export const runtime = "nodejs";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  // Photos privées : seul l'admin connecté peut y accéder.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await params;
  const photo = await readPhoto(filename);
  if (!photo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(photo.buffer), {
    status: 200,
    headers: {
      "Content-Type": photo.mimeType,
      "Content-Length": String(photo.buffer.length),
      "Cache-Control": "private, max-age=300",
    },
  });
}
