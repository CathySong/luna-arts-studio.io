"use client";
import FallEnrollmentHero from "@/components/FallEnrollmentHero";
import AboutPreview from "@/components/AboutPreview";
import FounderBio from "@/components/FounderBio";
import GalleryPreview from "@/components/GalleryPreview";
import ClassesPreview from "@/components/ClassesPreview";
import FallSessionsSection from "@/components/FallSessionsSection";
import ScheduleSection from "@/components/ScheduleSection";
import ContactSection from "@/components/ContactSection";
import NewServicesPreview from "@/components/NewServicesPreview";

export default function Home() {
  return (
    <>
      {/* Fall Enrollment Hero with promo banner */}
      <FallEnrollmentHero />

      <AboutPreview />
      <FounderBio />
      <GalleryPreview />
      <ClassesPreview />

      <NewServicesPreview />

      {/* Fall sessions (replaces summer camp) */}
      <FallSessionsSection />
      <ScheduleSection />
      <ContactSection />
    </>
  );
}
