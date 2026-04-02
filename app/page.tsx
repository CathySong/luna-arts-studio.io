"use client";
import SummerCampHero from "@/components/SummerCampHero";
import AboutPreview from "@/components/AboutPreview";
import GalleryPreview from "@/components/GalleryPreview";
import ClassesPreview from "@/components/ClassesPreview";
import CampSection from "@/components/CampSection";
import ScheduleSection from "@/components/ScheduleSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      {/* Summer Camp Hero with Red Banner */}
      <SummerCampHero />
      
      {/* 原有内容 */}
      <AboutPreview />
      <GalleryPreview />
      <ClassesPreview />
      <CampSection />
      <ScheduleSection />
      <ContactSection />
    </>
  );
}