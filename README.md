# 🌙 Luna Art Studio

A cinematic, production-ready website for **Luna Art Studio** — built with Next.js 14, Tailwind CSS, and TypeScript. Deployable to Vercel in minutes.

![Luna Art Studio](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## ✨ Features

- **Cinematic Hero** – Particle‑based animated background with elegant typography
- **Gallery Preview** – Showcases artwork with hover details and smooth transitions
- **Class Schedule** – Visual weekly calendar with interactive time slots
- **Responsive & Accessible** – Fully responsive, WCAG‑friendly, semantic markup
- **Performance Optimized** – Next.js Image, code splitting, minimal runtime
- **Easy to Customize** – Replace images, update text, adjust colors in minutes

## 🚀 Quick Start

1. **Clone & install**
   ```bash
   git clone https://github.com/CathySong/luna-arts-studio.io.git
   cd luna-arts-studio
   npm install
   ```

2. **Run locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

3. **Deploy to Vercel**
   ```bash
   npm run build
   vercel --prod
   ```

## 📁 Project Structure

```
luna-art-studio/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout (fonts, metadata, Navbar/Footer)
│   ├── page.tsx           # Home page (Hero → About → Gallery → Classes → Contact)
│   └── globals.css        # Global styles & Tailwind directives
├── components/            # Reusable components
│   ├── Navbar.tsx         # Fixed navigation with scroll effects
│   ├── Hero.tsx           # Animated particle background + headline
│   ├── AboutPreview.tsx   # "Our Story" section with image & stats
│   ├── GalleryPreview.tsx # Artwork grid with hover details
│   ├── ClassesPreview.tsx # Class offerings with icons
│   ├── WeeklyScheduleImages.tsx # Visual schedule blocks
│   ├── ScheduleSection.tsx # Detailed schedule table
│   └── ContactSection.tsx # Contact form + studio info
├── public/                # Static assets
│   ├── luna.png           # Studio logo
│   ├── images/            # Gallery & background images
│   └── videos/            # Demo video (optional)
└── lib/                   # Utilities
    └── useInView.ts       # Intersection Observer hook
```

## 🎨 Customization

### Replace Images
1. **Logo** – Replace `public/luna.png`
2. **Gallery artwork** – Add images to `public/images/artworks/` and update `GalleryPreview.tsx`
3. **Background photos** – Add to `public/images/backgrounds/` and update corresponding components

### Update Content
- **Text** – Edit component files in `components/`
- **Colors** – Modify Tailwind colors in `tailwind.config.js`
- **Schedule** – Update `WeeklyScheduleImages.tsx` and `ScheduleSection.tsx`
- **Contact info** – Edit `ContactSection.tsx`

### Brand Colors (Tailwind)
- `ink` – Deep charcoal (`#0b0a09`)
- `parchment` – Warm off‑white (`#f5f0e8`)
- `gold` – Metallic gold (`#c9a96e`)
- `sage` – Muted green (`#7a8c7e`)
- `clay` – Terracotta (`#c4785a`)
- `mist` – Soft gray (`#9ba8b0`)

## 🔧 Tech Stack

- **Next.js 14** – React framework with App Router
- **Tailwind CSS** – Utility‑first styling
- **TypeScript** – Type safety
- **Lucide React** – Icon library
- **Vercel** – Deployment & hosting

## 📄 License

MIT – free to use, modify, and deploy.

---

**Built with care for artists & creatives.** 🎨