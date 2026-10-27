"use client";
import FallEnrollmentHero from "@/components/FallEnrollmentHero";
import AboutPreview from "@/components/AboutPreview";
import FounderBio from "@/components/FounderBio";
import GalleryPreview from "@/components/GalleryPreview";
import ClassesPreview from "@/components/ClassesPreview";
import FallSessionsSection from "@/components/FallSessionsSection";
import ContactSection from "@/components/ContactSection";
import NewServicesPreview from "@/components/NewServicesPreview";

export default function Home() {
  return (
    <>
      {/* Winter Enrollment Hero with promo banner */}
      <FallEnrollmentHero />

      <AboutPreview />
      <FounderBio />
      <GalleryPreview />
      <ClassesPreview />

      <NewServicesPreview />

      {/* Winter sessions + registration */}
      <FallSessionsSection />
      <ContactSection />
    </>
  );
}
