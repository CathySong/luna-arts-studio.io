import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon: sage green with a larger crescent + "Luna" wordmark.
// Apple icons are 180x180 with no transparency and no rounded corners
// (iOS applies the mask itself).
export default function AppleIcon() {
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
          color: "#f5f0e8", // parchment
          gap: 4,
        }}
      >
        <div style={{ fontSize: 100, lineHeight: 1, display: "flex" }}>☾</div>
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 500,
            display: "flex",
          }}
        >
          Luna
        </div>
      </div>
    ),
    { ...size }
  );
}
