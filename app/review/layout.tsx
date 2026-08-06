import type { Metadata } from "next";

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export const metadata: Metadata = {
  title: "Google Review Studio | Luna Art Studio",
  description:
    "Generate a warm, SEO-friendly Google review for Luna Art Studio in Warren NJ — Creative, Drawing, Oil Painting & Handcraft classes.",
  robots: {
    index: false,
    follow: false,
  },
};
