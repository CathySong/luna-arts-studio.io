"use client";
import AboutPreview from "@/components/AboutPreview";
import GalleryPreview from "@/components/GalleryPreview";
import ClassesPreview from "@/components/ClassesPreview";
import WeeklyScheduleImages from "@/components/WeeklyScheduleImages";
import ScheduleSection from "@/components/ScheduleSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      {/* 移除Hero组件，直接从AboutPreview开始 */}
      <AboutPreview />
      <GalleryPreview />
      <ClassesPreview />
      <WeeklyScheduleImages />
      <ScheduleSection />
      <ContactSection />
    </>
  );
}