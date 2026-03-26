/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-jost)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      colors: {
        // 白色/灰白色调 - 高雅艺术主题
        white: "#ffffff",
        "white-pure": "#ffffff",
        "white-warm": "#faf9f7",
        "white-cool": "#f8f9fa",
        "white-soft": "#f5f5f5",
        
        // 灰色调 - 用于层次和对比
        "gray-lightest": "#f0f0f0",
        "gray-lighter": "#e8e8e8",
        "gray-light": "#d8d8d8",
        "gray": "#b0b0b0",
        "gray-dark": "#888888",
        "gray-darker": "#606060",
        "gray-darkest": "#383838",
        
        // 强调色 - 保持温暖但更柔和
        "accent-warm": "#d4b483",  // 柔和的米金色
        "accent-cool": "#a8b8c8",  // 柔和的灰蓝色
        "accent-neutral": "#c0c0c0", // 中性灰色
        
        // 额外的强调色变体
        "accent-warm-light": "#e8d4b0",  // 更亮的暖强调色
        "accent-cool-light": "#c8d8e8",  // 更亮的冷强调色
      },
      letterSpacing: {
        widest: "0.25em",
        ultra: "0.4em",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-in": "fadeIn 1s ease forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
