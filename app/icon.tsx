import { ImageResponse } from "next/og";

// 48×48 meets Google's recommended minimum for SERP site icons.
export const size = { width: 48, height: 48 };
export const contentType = "image/png";

// Favicon: a sage-green rounded square with a crescent moon glyph (Luna brand).
// Using ImageResponse (Edge runtime) so we don't depend on the JPEG/PNG raster
// at the public/ root — the design is locked to the brand.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 36,
          background: "#7a8c7e", // sage green
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9,
          color: "#f5f0e8", // parchment
        }}
      >
        ☾
      </div>
    ),
    { ...size }
  );
}
