// Fall Enrollment Configuration
// Update the Google Form URL here when you have the actual Fall form link

export type WeeklyClassSlot = {
  time: string;
  title: string;
  ages?: string;
  duration: string;
};

export type WeeklyDaySchedule = {
  day: string;
  dayShort: string;
  slots: WeeklyClassSlot[];
};

export const fallEnrollmentConfig = {
  // Fall registration Google Form
  registrationFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLScMgvFa4_RkTECBlZOzSnDbBS_rXyr0bKrQsR1IedM2PZnyuQ/viewform?usp=header",

  seasonLabel: "Fall 2026 Enrollment",
  headline: "Fall Classes Now Open",
  subheadline:
    "Wed–Sat weekly classes · Clear age groups · Private lessons by appointment · Limited spots",

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
      note: "9 weekly classes · same session window Wed–Sat",
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
      note: "10 weekly classes · holiday break late December · same session window Wed–Sat",
    },
  ],

  // Canonical weekly timetable — one clear list so students pick the right slot.
  weeklySchedule: [
    {
      day: "Wednesday",
      dayShort: "Wed",
      slots: [
        {
          time: "10:00–11:30 AM",
          title: "Adult Drawing",
          ages: "Adults",
          duration: "90 min",
        },
        {
          time: "5:30–7:00 PM",
          title: "Drawing & Creative Studio",
          ages: "Ages 9–11",
          duration: "90 min",
        },
      ],
    },
    {
      day: "Thursday",
      dayShort: "Thu",
      slots: [
        {
          time: "4:15–5:45 PM",
          title: "Sewing & Textile Art",
          duration: "90 min",
        },
        {
          time: "6:00–7:30 PM",
          title: "Drawing Fundamentals & Painting",
          ages: "Ages 9+",
          duration: "90 min",
        },
      ],
    },
    {
      day: "Friday",
      dayShort: "Fri",
      slots: [
        {
          time: "3:30–5:00 PM",
          title: "Creative Art",
          ages: "Ages 4–6",
          duration: "90 min",
        },
        {
          time: "5:00–6:30 PM",
          title: "Creative Art",
          ages: "Ages 6–9",
          duration: "90 min",
        },
      ],
    },
    {
      day: "Saturday",
      dayShort: "Sat",
      slots: [
        {
          time: "2:30–4:00 PM",
          title: "Mixed Media",
          ages: "Ages 8+",
          duration: "90 min",
        },
        {
          time: "4:15–5:45 PM",
          title: "Creative Art",
          ages: "Ages 5–8",
          duration: "90 min",
        },
      ],
    },
  ] as WeeklyDaySchedule[],

  privateLesson: {
    title: "Private Lesson",
    note: "Please contact us to schedule",
  },

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
