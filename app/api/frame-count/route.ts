import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

// Force this route to execute on every request rather than being
// statically cached at build time — frames can be added/removed
// without a rebuild and this endpoint will always reflect reality.
export const dynamic = "force-dynamic";

const FRAMES_DIR = path.join(process.cwd(), "public", "hero", "frames");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export async function GET() {
  try {
    const entries = await readdir(FRAMES_DIR);

    const frames = entries
      .filter((file) => IMAGE_EXT.has(path.extname(file).toLowerCase()))
      // Natural sort so frame_2.jpg doesn't sort after frame_10.jpg
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    return NextResponse.json({
      count: frames.length,
      files: frames,
    });
  } catch (err) {
    return NextResponse.json(
      {
        count: 0,
        files: [],
        error:
          "Could not read public/hero/frames — make sure the folder exists and contains frame images (e.g. frame_0001.jpg).",
      },
      { status: 200 }
    );
  }
}
