import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const type = (formData.get("type") as string) || "item";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, GIF, and AVIF are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Generate unique filename with type-based prefix
    const validPrefixes = ["item", "profile", "banner"];
    const prefix = validPrefixes.includes(type) ? type : "item";
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const extension = file.name.split(".").pop();
    const filename = `${prefix}_${timestamp}_${random}.${extension}`;

    // Get path to public/uploaded
    const uploadsDir = path.join(process.cwd(), "public", "uploaded");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write file
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({ filename });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};
