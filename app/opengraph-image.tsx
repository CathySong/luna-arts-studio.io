import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Luna Art Studio — Fine Art & Creative Classes in Warren, NJ";

// Open Graph / social preview image.
//
// Brand palette (from tailwind.config.js): ink #0b0a09, parchment #f5f0e8,
// gold #c9a96e, sage #7a8c7e.
//
// Design: full-bleed sage-green background (matches logo) with the actual
// /public/luna.jpg logo centered at 480px tall. Logo is the focus; tagline
// is small below. This composition is safe for ALL crop ratios:
//   - 1200x630 (Twitter/LinkedIn/FB desktop) ✅
//   - 1.91:1 mobile crops (Twitter mobile drops bottom 30px) ✅
//   - 1:1 square center crop (Google search results) ✅
//   - 16:9 thumbnail (some chat apps) ✅
//
// Logo is read at build time from public/ and embedded as a base64 data
// URI in the ImageResponse — this works in both edge runtime and Node.
export default async function OpengraphImage() {
  // Load the actual Luna logo from public/
  const logoPath = join(process.cwd(), "public", "luna.jpg");
  const logoBuffer = await readFile(logoPath);
  const logoSrc = `data:image/jpeg;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#7a8c7e", // sage
          padding: "60px 60px 50px 60px",
        }}
      >
        {/* Centered logo — 500x500, no risk of being cropped on any
            aspect ratio (1.91:1 OG, 1:1 square, 16:9, etc.) */}
        <img
          src={logoSrc}
          width={500}
          height={500}
          style={{
            objectFit: "contain",
            display: "flex",
          }}
        />
        {/* No tagline: the logo already carries the brand. Removing the
            text strip ensures even 1:1 center crops show the full logo
            with no text cut off. */}
      </div>
    ),
    { ...size }
  );
}
