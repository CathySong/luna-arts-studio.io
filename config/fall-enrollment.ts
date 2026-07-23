// Fall Enrollment Configuration
// Update the Google Form URL here when you have the actual Fall form link

export const fallEnrollmentConfig = {
  // Fall registration Google Form
  registrationFormUrl: "https://forms.gle/AFNYCseZ74WY3zKf8",

  seasonLabel: "Fall 2026 Enrollment",
  headline: "Fall Classes Now Open",
  subheadline:
    "Weekly Wednesday art classes · 4:30–6:00 PM & 6:15–7:45 PM · Limited spots",

  dayOfWeek: "Wednesday",

  classTimes: [
    {
      id: "early",
      label: "4:30 PM – 6:00 PM",
      start: "4:30 PM",
      end: "6:00 PM",
    },
    {
      id: "late",
      label: "6:15 PM – 7:45 PM",
      start: "6:15 PM",
      end: "7:45 PM",
    },
  ],

  sessions: [
    {
      id: "session-1",
      name: "Session 1",
      label: "Fall Session 1",
      startDisplay: "Sep 9",
      endDisplay: "Nov 4",
      classCount: 9,
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
      note: "9 weekly Wednesday classes",
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
      note: "10 weekly Wednesday classes · Holiday break late December",
    },
  ],

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
