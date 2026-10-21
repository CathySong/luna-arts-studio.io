import OpenAI from "openai";

import { fallEnrollmentConfig } from "@/config/fall-enrollment";
import { summerCampConfig } from "@/config/summer-camp";
import { getSmsKnowledge } from "./knowledge";

export const HUMAN_FOLLOW_UP_EN =
  "I'm not certain about that. Luna will contact you personally soon.";
export const HUMAN_FOLLOW_UP_ZH =
  "这个问题我暂时无法确认，Luna 会尽快亲自联系您。";

type AgentDecision = {
  canAnswer: boolean;
  reply: string;
};

type Intent = {
  patterns: RegExp[];
  en: string;
  zh: string;
};

function isLikelyChinese(text: string) {
  return /[\u3400-\u9fff]/.test(text);
}
const intents: Intent[] = [
  {
    patterns: [/\b(address|located|location|where are you)\b/i, /地址|位置|在哪里|怎么走/],
    en: `Luna Art Studio is at ${fallEnrollmentConfig.contact.address}, on the 2nd floor.`,
    zh: `Luna Art Studio 地址是 ${fallEnrollmentConfig.contact.address}，位于二楼。`,
  },
  {
    patterns: [/\b(hours?|open|close|closing)\b/i, /营业时间|几点开门|几点关门|工作时间/],
    en: "Studio hours are Mon-Fri 9 AM-8 PM and Sat-Sun 10 AM-6 PM.",
    zh: "工作室开放时间：周一至周五 9 AM-8 PM，周六和周日 10 AM-6 PM。",
  },
  {
    patterns: [/\b(phone|email|wechat|contact)\b/i, /电话|邮箱|邮件|微信|联系方式|联系/],
    en: `Contact Luna Art Studio at ${fallEnrollmentConfig.contact.phone}, ${fallEnrollmentConfig.contact.email}, or WeChat ${fallEnrollmentConfig.contact.wechat}.`,
    zh: `可联系 Luna Art Studio：电话 ${fallEnrollmentConfig.contact.phone}，邮箱 ${fallEnrollmentConfig.contact.email}，微信 ${fallEnrollmentConfig.contact.wechat}。`,
  },
  {
    patterns: [/\b(fall|autumn).*(schedule|class|session|time|date)\b/i, /\b(schedule|time|date).*(fall|autumn)\b/i, /秋季.*(课表|课程|时间|日期)|课表/],
    en: "Fall classes: Wed 4:00 Drawing & Creative ages 8-10 and 5:30 Creative Art ages 5-9; Thu 4:30 Sewing ages 6+ and 6:00 Drawing Fundamentals & Painting ages 9+; Fri 3:30 Creative Art ages 4-6 and 5:00 Creative Art ages 6-9; Sat 2:30 Mixed Media ages 8+.",
    zh: "秋季课表：周三4:00绘画与创意(8-10岁)、5:30创意美术(5-9岁)；周四4:30缝纫(6岁+)、6:00素描与绘画基础(9岁+)；周五3:30创意美术(4-6岁)、5:00创意美术(6-9岁)；周六2:30混合媒材(8岁+)。",
  },
  {
    patterns: [/\b(register|registration|enroll|sign up)\b/i, /报名|注册|怎么参加/],
    en: `Fall registration: ${fallEnrollmentConfig.registrationFormUrl}`,
    zh: `秋季课程报名链接：${fallEnrollmentConfig.registrationFormUrl}`,
  },
  {
    patterns: [/\b(private lesson|one.?on.?one)\b/i, /私教|一对一|私人课程/],
    en: "Private lessons are available by appointment. Please contact Luna to schedule.",
    zh: "可预约一对一私教课，请联系 Luna 安排时间。",
  },
  {
    patterns: [/\b(summer camp|camp)\b/i, /夏令营|暑期营/],
    en: `Summer camp runs ${summerCampConfig.campDates.display}. Morning half-day is ${summerCampConfig.pricing.halfDayMorning}, afternoon half-day ${summerCampConfig.pricing.halfDayAfternoon}, and full day ${summerCampConfig.pricing.fullDay}.`,
    zh: `2026 夏令营日期为 ${summerCampConfig.campDates.display}。上午半天 ${summerCampConfig.pricing.halfDayMorning}，下午半天 ${summerCampConfig.pricing.halfDayAfternoon}，全天 ${summerCampConfig.pricing.fullDay}。`,
  },
  {
    patterns: [/\b(birthday|party|group event)\b/i, /生日派对|生日会|团体活动/],
    en: "Two-hour creative parties include materials for up to 12 children. Studio parties start at $320 for 6; on-site parties start at $350 for 6. Food and decorations aren't included.",
    zh: "两小时创意派对包含材料，最多12名儿童。工作室派对6人$320起，上门派对6人$350起；不含食物和场地装饰。",
  },
  {
    patterns: [/\b(sewing|tailor|alteration|hemming)\b/i, /缝纫|裁缝|改衣|裤脚/],
    en: "Luna offers sewing classes, alterations, hemming, and custom apparel. Alterations usually take 2-5 business days; custom work requires a quote.",
    zh: "Luna 提供缝纫课、改衣、裤脚修改和定制服装。普通改衣通常需2-5个工作日，定制项目需联系报价。",
  },
  {
    patterns: [/\b(classes?|art class|drawing|painting|creative art|mixed media|handcraft)\b/i, /课程|美术课|画画|素描|油画|创意课|手工课|混合媒材/],
    en: "Luna offers creative art, drawing, oil painting, handcraft, mixed media, sewing, and private lessons for different ages and levels. See https://lunaart.studio for details.",
    zh: "Luna 提供创意美术、素描、油画、手工、混合媒材、缝纫和私教课程，适合不同年龄和基础。详情见 https://lunaart.studio。",
  },
  {
    patterns: [/^(hi|hello|hey|good morning|good afternoon|good evening)[!. ]*$/i, /^(你好|您好|嗨)[！!。 ]*$/],
    en: "Hi! This is Luna Art Studio. Ask me about classes, schedules, registration, parties, sewing, summer camp, hours, or location.",
    zh: "您好！这里是 Luna Art Studio。您可以询问课程、课表、报名、生日派对、缝纫、夏令营、营业时间或地址。",
  },
];

export async function generateSmsReply(message: string): Promise<AgentDecision> {
  const trimmedMessage = message.trim().slice(0, 800);
  const chinese = isLikelyChinese(trimmedMessage);

  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (apiKey) {
    try {
      const smsKnowledge = await getSmsKnowledge();
      const client = new OpenAI({ apiKey, baseURL: "https://api.deepseek.com" });
      const completion = await client.chat.completions.create({
        model: process.env.DEEPSEEK_MODEL?.trim() || "deepseek-flash",
        response_format: { type: "json_object" },
        max_tokens: 180,
        messages: [
          {
            role: "system",
            content: `You are the SMS assistant for Luna Art Studio. Answer only from the official facts below.

Return JSON exactly as {"canAnswer":boolean,"reply":string}.
- Every reply must begin with "Luna Art Studio:".
- Use the customer's language (English or Chinese).
- Keep the entire reply concise and under 320 characters.
- Never invent dates, pricing, availability, policies, or student information.
- If the facts do not fully answer the question, set canAnswer=false and say that Luna will follow up personally.

${smsKnowledge}`,
          },
          { role: "user", content: trimmedMessage },
        ],
      });
      const content = completion.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content) as Partial<AgentDecision>;
        if (typeof parsed.canAnswer === "boolean" && typeof parsed.reply === "string") {
          const reply = parsed.reply.trim().slice(0, 320);
          return {
            canAnswer: parsed.canAnswer,
            reply: /^Luna Art Studio:/i.test(reply)
              ? reply
              : `Luna Art Studio: ${reply}`,
          };
        }
      }
    } catch (error) {
      console.error("[sms/agent] DeepSeek reply failed; using deterministic fallback", error);
    }
  }

  const intent = intents.find(({ patterns }) =>
    patterns.some((pattern) => pattern.test(trimmedMessage))
  );

  if (!intent) {
    return {
      canAnswer: false,
      reply: `Luna Art Studio: ${chinese ? HUMAN_FOLLOW_UP_ZH : HUMAN_FOLLOW_UP_EN}`,
    };
  }

  return {
    canAnswer: true,
    reply: `Luna Art Studio: ${chinese ? intent.zh : intent.en}`,
  };
}
