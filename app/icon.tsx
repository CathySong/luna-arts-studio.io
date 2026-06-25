import { ImageResponse } from "next/og";

// Image response size for favicon
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon: a sage-green rounded square with a crescent moon glyph (Luna brand).
// Using ImageResponse (Edge runtime) so we don't depend on the JPEG/PNG raster
// at the public/ root — the design is locked to the brand.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "#7a8c7e", // sage green
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          color: "#f5f0e8", // parchment
        }}
      >
        ☾
      </div>
    ),
    { ...size }
  );
}
