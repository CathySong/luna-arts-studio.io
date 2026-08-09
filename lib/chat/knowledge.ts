import { fallEnrollmentConfig } from "@/config/fall-enrollment";
import { summerCampConfig } from "@/config/summer-camp";

/**
 * Studio knowledge injected into the Luna chatbot system prompt.
 * Update prices here when tuition changes — the bot must not invent numbers.
 */
export const studioPricing = {
  fallGroupClasses: {
    status: "contact_for_rate" as const,
    note:
      "Fall weekly group class tuition is not published as a fixed public rate on the website. For current Fall session pricing, private lesson rates, and package options, please contact the studio or register via the Fall enrollment form and we will confirm pricing.",
  },
  privateLesson: {
    status: "contact_for_rate" as const,
    note: "Private lessons are by appointment. Contact the studio for availability and rates.",
  },
  summerCamp: summerCampConfig.pricing,
  summerCampDiscounts: summerCampConfig.discounts,
  birthdayParties: {
    studio: { base: "$320", includes: "up to 6 children", additionalChild: "$45" },
    onSite: { base: "$350", includes: "up to 6 children", additionalChild: "$50" },
  },
  sewingAlterations: {
    from: "$15",
    note: "Basic alterations start from $15. Custom design and sewing class pricing — contact the studio.",
  },
};

export function buildStudioKnowledge(): string {
  const { sessions, weeklySchedule, privateLesson, contact, registrationFormUrl, seasonLabel } =
    fallEnrollmentConfig;

  const scheduleLines = weeklySchedule
    .flatMap((day) =>
      day.slots.map((slot) => {
        const ages = slot.ages ? ` (${slot.ages})` : "";
        return `- ${day.day} ${slot.time}: ${slot.title}${ages} · ${slot.duration}`;
      })
    )
    .join("\n");

  const sessionLines = sessions
    .map(
      (s) =>
        `- ${s.name} (${s.label}): ${s.startDisplay} – ${s.endDisplay}, ${s.classCount} weekly classes. ${s.note}`
    )
    .join("\n");

  return `
STUDIO
- Name: Luna Art Studio
- Address: ${contact.address} (2nd Floor)
- Phone: ${contact.phone}
- Email: ${contact.email}
- WeChat: ${contact.wechat}
- Hours: Mon–Fri 9AM–8PM · Sat–Sun 10AM–6PM
- Location: Warren, New Jersey

CURRENT ENROLLMENT
- ${seasonLabel}
- Registration form: ${registrationFormUrl}
- No classes on Monday or Tuesday for Fall weekly group classes
- Private lesson: ${privateLesson.title} — ${privateLesson.note}

FALL SESSIONS
${sessionLines}

FALL WEEKLY CLASS SCHEDULE (all group classes 90 min unless noted)
${scheduleLines}

PRICING (only use these facts — never invent tuition numbers)
- Fall weekly group classes: ${studioPricing.fallGroupClasses.note}
- Private lessons: ${studioPricing.privateLesson.note}
- Summer Camp 2026 (${summerCampConfig.campDates.display}): half-day morning ${studioPricing.summerCamp.halfDayMorning}/day, half-day afternoon ${studioPricing.summerCamp.halfDayAfternoon}/day, full day ${studioPricing.summerCamp.fullDay}/day. Discounts: ${studioPricing.summerCampDiscounts.referral.percentage} ${studioPricing.summerCampDiscounts.referral.description}; ${studioPricing.summerCampDiscounts.multiWeek.percentage} ${studioPricing.summerCampDiscounts.multiWeek.description}.
- Birthday parties: studio ${studioPricing.birthdayParties.studio.base} (${studioPricing.birthdayParties.studio.includes}, +${studioPricing.birthdayParties.studio.additionalChild}/extra child); on-site ${studioPricing.birthdayParties.onSite.base} (${studioPricing.birthdayParties.onSite.includes}, +${studioPricing.birthdayParties.onSite.additionalChild}/extra child).
- Sewing / alterations: from ${studioPricing.sewingAlterations.from}. ${studioPricing.sewingAlterations.note}

HOW TO ENROLL OR ASK ABOUT PRICE
- Fall classes: use the registration Google Form, or contact by phone / WeChat / email / website contact form
- Suggest linking users to #contact on the website or the registration form when they need a human follow-up
`.trim();
}
