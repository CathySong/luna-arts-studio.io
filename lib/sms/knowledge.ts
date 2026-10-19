import { classTypes } from "@/config/classes";
import { fallEnrollmentConfig } from "@/config/fall-enrollment";
import { summerCampConfig } from "@/config/summer-camp";

const classCatalog = classTypes
  .map(
    (classType) =>
      `- ${classType.title}: ${classType.description} Duration: ${classType.durationLabel}. Level: ${classType.level}.`
  )
  .join("\n");

const fallSchedule = fallEnrollmentConfig.weeklySchedule
  .map(
    (day) =>
      `- ${day.day}: ${day.slots
        .map(
          (slot) =>
            `${slot.time}, ${slot.title}${slot.ages ? ` (${slot.ages})` : ""}`
        )
        .join("; ")}`
  )
  .join("\n");

export const smsKnowledge = `
Luna Art Studio official website facts:

Contact and location
- Website: https://lunaart.studio
- Address: ${fallEnrollmentConfig.contact.address}, 2nd Floor.
- Phone: ${fallEnrollmentConfig.contact.phone}.
- Email: ${fallEnrollmentConfig.contact.email}.
- WeChat: ${fallEnrollmentConfig.contact.wechat}.
- Public studio hours: Monday-Friday 9 AM-8 PM; Saturday-Sunday 10 AM-6 PM.

Classes
${classCatalog}

Fall 2026 enrollment
- ${fallEnrollmentConfig.sessions[0].label}: ${fallEnrollmentConfig.sessions[0].startDisplay}-${fallEnrollmentConfig.sessions[0].endDisplay}, ${fallEnrollmentConfig.sessions[0].classCount} weekly classes.
- ${fallEnrollmentConfig.sessions[1].label}: ${fallEnrollmentConfig.sessions[1].startDisplay}-${fallEnrollmentConfig.sessions[1].endDisplay}, ${fallEnrollmentConfig.sessions[1].classCount} weekly classes, with a late-December holiday break.
${fallSchedule}
- Private lessons are available by appointment; contact the studio to schedule.
- Fall registration: ${fallEnrollmentConfig.registrationFormUrl}

Birthday parties and group events
- Two-hour creative workshops for up to 12 children; materials and take-home creations are included.
- Themes include hair accessories, jewelry, handmade soap, custom fashion, and custom mugs.
- Studio party: $320 for up to 6 children, then $45 per additional child.
- On-site party: $350 for up to 6 children, then $50 per additional child.
- Decorations and food/catering are not included.

Tailoring and sewing
- Alterations and hemming generally take 2-5 business days.
- Custom apparel design generally takes 3-7 business days.
- Sewing machines, tools, and beginner materials are provided for sewing classes.
- Tailoring and custom work require contacting the studio for a quote.

Summer camp 2026
- Dates: ${summerCampConfig.campDates.display}.
- Half-day morning: ${summerCampConfig.pricing.halfDayMorning}; half-day afternoon: ${summerCampConfig.pricing.halfDayAfternoon}; full day: ${summerCampConfig.pricing.fullDay}.
- Referral and multi-week discounts are each 5%.
- Registration: ${summerCampConfig.registrationFormUrl}
`.trim();
