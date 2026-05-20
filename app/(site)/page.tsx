"use client";
import SummerCampHero from "@/components/SummerCampHero";
import AboutPreview from "@/components/AboutPreview";
import GalleryPreview from "@/components/GalleryPreview";
import ClassesPreview from "@/components/ClassesPreview";
import CampSection from "@/components/CampSection";
import ScheduleSection from "@/components/ScheduleSection";
import ContactSection from "@/components/ContactSection";
import NewServicesPreview from "@/components/NewServicesPreview";

export default function Home() {
  return (
    <>
      {/* Summer Camp Hero with Red Banner */}
      <SummerCampHero />
      
      {/* 原有内容 */}
      <AboutPreview />
      <GalleryPreview />
      <ClassesPreview />
      
      {/* New Services Preview */}
      <NewServicesPreview />
      
      {/* 原有内容 */}
      <CampSection />
      <ScheduleSection />
      <ContactSection />
    </>
  );
}