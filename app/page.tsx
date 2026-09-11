"use client";
import Hero from "@/components/Hero";
import AboutPreview from "@/components/AboutPreview";
import GalleryPreview from "@/components/GalleryPreview";
import ClassesPreview from "@/components/ClassesPreview";
import ScheduleSection from "@/components/ScheduleSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <GalleryPreview />
      <ClassesPreview />
      <ScheduleSection />
      <ContactSection />
    </>
  );
}
