# 🌙 Luna Art Studio

A cinematic, production-ready website for **Luna Art Studio** — built with Next.js 14, Tailwind CSS, and TypeScript. Deployable to Vercel in minutes.

![Luna Arts Studio](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## ✨ Features

| Section | Description |
|---|---|
| **Hero** | Full-screen with animated particle canvas, staggered text reveals |
| **About** | Studio story, stats, scroll-triggered animations |
| **Gallery** | 6-artwork grid with hover overlays, pricing, and inquiry buttons |
| **Classes** | 6 class types with levels, duration, and descriptions |
| **Schedule** | Interactive weekly timetable, filter by day, spot availability |
| **Contact** | Inquiry form with API route, interest selector |
| **Footer** | Navigation, contact info, social links |

### 🔮 Future-Ready (Optional)
- **Artwork Purchase** — Stripe integration scaffolded in `.env.example`
- **Email notifications** — Resend commented & ready in `app/api/contact/route.ts`

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
RESEND_API_KEY=re_your_key_here
STUDIO_EMAIL=Ninglu1088@gmail.com
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

### Option B — GitHub Integration (recommended)

1. Push this repo to GitHub:
```bash
git init
git add .
git commit -m "feat: initial Luna Art Studio site"
git remote add origin https://github.com/YOUR_USERNAME/luna-arts-studio.git
git branch -M main
git push -u origin main
```

2. Go to [vercel.com/new](https://vercel.com/new) → Import your GitHub repo
3. Add Environment Variables in the Vercel dashboard
4. Deploy 🚀

---

## 📧 Enable Contact Form Emails

The contact form API is at `app/api/contact/route.ts`. To receive real emails:

1. Create a free account at [resend.com](https://resend.com)
2. Get your API key
3. Add `RESEND_API_KEY` to your Vercel environment variables
4. Uncomment the Resend block in `app/api/contact/route.ts`

---

## 💳 Enable Artwork Purchases (Future)

Stripe integration is pre-scaffolded:

1. Create a [Stripe](https://stripe.com) account
2. Add keys to `.env.local`:
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
3. Add a `app/api/checkout/route.ts` with `stripe.checkout.sessions.create()`
4. Update gallery cards to link to checkout

---

## 🎨 Customization

### Update Studio Info

- **Name / address / phone**: `components/ContactSection.tsx` and `components/Footer.tsx`
- **Classes**: Edit the `classes` array in `components/ClassesPreview.tsx`
- **Schedule**: Edit the `schedule` object in `components/ScheduleSection.tsx`
- **Gallery artworks**: Edit the `artworks` array in `components/GalleryPreview.tsx`
- **Hero headline**: `components/Hero.tsx`

### Colors & Fonts

Edit `tailwind.config.js` and `app/globals.css`:

```js
colors: {
  ink: "#0e0d0b",       // background
  parchment: "#f5f0e8", // light text
  gold: "#c9a96e",      // accent
  sage: "#7a8c7e",      // secondary
  clay: "#c4785a",      // warm accent
}
```

### Add Real Artwork Images

Replace the SVG placeholders in `GalleryPreview.tsx` with `next/image`:

```tsx
import Image from "next/image";
// ...
<Image src="/gallery/artwork-1.jpg" alt="Golden Hour" fill className="object-cover" />
```

Place images in the `public/gallery/` folder.

---

## 🗂 Project Structure

```
luna-arts-studio/
├── app/
│   ├── api/contact/route.ts   # Contact form API
│   ├── globals.css            # Global styles + grain texture
│   ├── layout.tsx             # Root layout + SEO
│   └── page.tsx               # Home page
├── components/
│   ├── Navbar.tsx             # Sticky nav + mobile menu
│   ├── Hero.tsx               # Animated hero section
│   ├── AboutPreview.tsx       # Studio story
│   ├── GalleryPreview.tsx     # Artwork grid
│   ├── ClassesPreview.tsx     # Class cards
│   ├── ScheduleSection.tsx    # Weekly timetable
│   ├── ContactSection.tsx     # Inquiry form
│   └── Footer.tsx             # Footer
├── lib/
│   └── useInView.ts           # Intersection observer hook
├── public/                    # Static assets
├── .env.example               # Environment variable template
├── vercel.json                # Vercel deployment config
└── tailwind.config.js         # Tailwind theme
```

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com)
- **Language**: TypeScript
- **Fonts**: Cormorant Garamond + Jost + DM Mono (Google Fonts)
- **Icons**: [Lucide React](https://lucide.dev)
- **Email**: [Resend](https://resend.com) (optional)
- **Payments**: [Stripe](https://stripe.com) (future/optional)
- **Hosting**: [Vercel](https://vercel.com)

---

## 📄 License

MIT — free to use and modify for Luna Art Studio.

---

*Built with love for art and the web. 🌙*
