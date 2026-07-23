// Fall Enrollment Configuration
// Update the Google Form URL here when you have the actual Fall form link

import { classTypes, type ClassTypeId } from "./classes";

export const fallEnrollmentConfig = {
  // Fall registration Google Form
  registrationFormUrl: "https://forms.gle/AFNYCseZ74WY3zKf8",

  seasonLabel: "Fall 2026 Enrollment",
  headline: "Fall Classes Now Open",
  subheadline:
    "Four class types · Monday–Saturday · Creative & Handcraft 60 min · Drawing & Oil Painting 90 min · Limited spots",

  // Session date anchors follow the established Wednesday calendar pattern.
  // Other weekdays use the same week windows (Session 1 / Session 2).
  sessions: [
    {
      id: "session-1",
      name: "Session 1",
      label: "Fall Session 1",
      startDisplay: "Sep 9",
      endDisplay: "Nov 4",
      classCount: 9,
      // Wednesday reference dates (other days run the same weeks)
      dates: [
        "Sep 9",
        "Sep 16",
        "Sep 23",
        "Sep 30",
        "Oct 7",
        "Oct 14",
        "Oct 21",
        "Oct 28",
        "Nov 4",
      ],
      note: "9 weekly classes · same session window Mon–Sat",
    },
    {
      id: "session-2",
      name: "Session 2",
      label: "Fall / Winter Session 2",
      startDisplay: "Nov 11",
      endDisplay: "Feb 3",
      classCount: 10,
      dates: [
        "Nov 11",
        "Nov 18",
        "Dec 2",
        "Dec 9",
        "Dec 16",
        "Jan 6",
        "Jan 13",
        "Jan 20",
        "Jan 27",
        "Feb 3",
      ],
      note: "10 weekly classes · holiday break late December · same session window Mon–Sat",
    },
  ],

  // Weekly timetable: each class type is offered across the week.
  // Drawing / Oil Painting = 90 min; Creative / Handcraft = 60 min.
  weeklySchedule: [
    {
      day: "Monday",
      dayShort: "Mon",
      slots: [
        { time: "4:30–5:30 PM", duration: "60 min", classTypeId: "creative" as ClassTypeId },
        { time: "5:45–7:15 PM", duration: "90 min", classTypeId: "drawing" as ClassTypeId },
      ],
    },
    {
      day: "Tuesday",
      dayShort: "Tue",
      slots: [
        { time: "4:30–5:30 PM", duration: "60 min", classTypeId: "handcraft" as ClassTypeId },
        { time: "5:45–7:15 PM", duration: "90 min", classTypeId: "oil-painting" as ClassTypeId },
      ],
    },
    {
      day: "Wednesday",
      dayShort: "Wed",
      slots: [
        { time: "4:30–6:00 PM", duration: "90 min", classTypeId: "drawing" as ClassTypeId },
        { time: "6:15–7:45 PM", duration: "90 min", classTypeId: "oil-painting" as ClassTypeId },
      ],
    },
    {
      day: "Thursday",
      dayShort: "Thu",
      slots: [
        { time: "4:30–5:30 PM", duration: "60 min", classTypeId: "creative" as ClassTypeId },
        { time: "5:45–7:15 PM", duration: "90 min", classTypeId: "drawing" as ClassTypeId },
      ],
    },
    {
      day: "Friday",
      dayShort: "Fri",
      slots: [
        { time: "4:30–5:30 PM", duration: "60 min", classTypeId: "handcraft" as ClassTypeId },
        { time: "5:45–7:15 PM", duration: "90 min", classTypeId: "oil-painting" as ClassTypeId },
      ],
    },
    {
      day: "Saturday",
      dayShort: "Sat",
      slots: [
        { time: "10:00–11:00 AM", duration: "60 min", classTypeId: "creative" as ClassTypeId },
        { time: "11:15 AM–12:45 PM", duration: "90 min", classTypeId: "drawing" as ClassTypeId },
        { time: "1:30–2:30 PM", duration: "60 min", classTypeId: "handcraft" as ClassTypeId },
        { time: "2:45–4:15 PM", duration: "90 min", classTypeId: "oil-painting" as ClassTypeId },
      ],
    },
  ],

  classTypes,

  contact: {
    email: "Ninglu1088@gmail.com",
    wechat: "happyevan999",
    phone: "+1 732-718-0639",
    address: "258 King George Rd, Warren, NJ 07059",
  },
};

export function getFallRegistrationUrl(source: string = "website") {
  const baseUrl = fallEnrollmentConfig.registrationFormUrl;
  return `${baseUrl}?entry.1234567890=${source}`;
}
