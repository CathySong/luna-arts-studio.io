#!/usr/bin/env python3
"""
修复版：更新GalleryPreview组件使用实际图片
"""

import json
import os

def create_artwork_data():
    """创建艺术作品数据"""
    artworks = [
        {
            'id': 1,
            'title': "Golden Hour",
            'medium': "Oil on Canvas",
            'size': "24 × 36 in",
            'year': "2024",
            'color': "from-amber-900/40 to-gold/20",
            'accent': "#c9a96e",
            'available': True,
            'price': "$1,200",
            'imagePath': "/images/artworks/artwork1.jpg"
        },
        {
            'id': 2,
            'title': "Sage Silence",
            'medium': "Watercolor",
            'size': "18 × 24 in",
            'year': "2024",
            'color': "from-sage/30 to-emerald-900/20",
            'accent': "#7a8c7e",
            'available': False,
            'price': "$680",
            'imagePath': "/images/artworks/artwork2.jpg"
        },
        {
            'id': 3,
            'title': "Terra Firma",
            'medium': "Acrylic & Charcoal",
            'size': "30 × 40 in",
            'year': "2023",
            'color': "from-clay/30 to-amber-900/20",
            'accent': "#c4785a",
            'available': True,
            'price': "$1,800",
            'imagePath': "/images/artworks/artwork3.jpg"
        },
        {
            'id': 4,
            'title': "Lunar Drift",
            'medium': "Ink & Gouache",
            'size': "16 × 20 in",
            'year': "2024",
            'color': "from-slate-700/40 to-mist/20",
            'accent': "#9ba8b0",
            'available': True,
            'price': "$540",
            'imagePath': "/images/artworks/artwork4.jpg"
        },
        {
            'id': 5,
            'title': "Embers",
            'medium': "Oil Pastel",
            'size': "12 × 16 in",
            'year': "2023",
            'color': "from-red-900/30 to-amber-700/20",
            'accent': "#d4845a",
            'available': False,
            'price': "$420",
            'imagePath': "/images/artworks/artwork5.jpg"
        },
        {
            'id': 6,
            'title': "Still Waters",
            'medium': "Watercolor",
            'size': "20 × 28 in",
            'year': "2024",
            'color': "from-blue-900/30 to-cyan-900/20",
            'accent': "#6a9ab0",
            'available': True,
            'price': "$760",
            'imagePath': "/images/artworks/artwork6.jpg"
        },
        {
            'id': 7,
            'title': "Violet Dreams",
            'medium': "Mixed Media",
            'size': "22 × 30 in",
            'year': "2024",
            'color': "from-purple-900/30 to-violet-900/20",
            'accent': "#8a6bb0",
            'available': True,
            'price': "$890",
            'imagePath': "/images/artworks/artwork7.jpg"
        }
    ]
    
    return artworks

def generate_gallery_component():
    """生成新的GalleryPreview组件代码"""
    artworks = create_artwork_data()
    artworks_json = json.dumps(artworks, indent=2)
    
    # 使用三引号字符串避免f-string嵌套问题
    component_code = '''"use client";
import { useRef, useState } from "react";
import { useInView } from "@/lib/useInView";
import Image from "next/image";

const artworks = ''' + artworks_json + ''';

function ArtCard({ art, delay }: { art: (typeof artworks)[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`group relative cursor-pointer transition-all duration-700`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Artwork image */}
      <div className={`relative aspect-[3/4] bg-gradient-to-br ${art.color} border border-white/5 overflow-hidden`}>
        <Image
          src={art.imagePath}
          alt={`${art.title} - ${art.medium}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
          priority={art.id <= 3}
        />
        
        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-ink/80 flex flex-col justify-end p-5 transition-all duration-400 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          <p className="font-mono text-[9px] tracking-widest uppercase text-gold/70 mb-1">{art.medium}</p>
          <p className="font-display text-xl text-parchment font-light mb-1">{art.title}</p>
          <p className="font-mono text-[9px] text-parchment/40">{art.size} · {art.year}</p>
          {art.available && (
            <div className="mt-3 flex items-center justify-between">
              <span className="font-body text-sm text-gold font-light">{art.price}</span>
              <button className="px-4 py-1.5 border border-gold/40 text-gold font-mono text-[9px] tracking-widest uppercase hover:bg-gold hover:text-ink transition-all duration-300">
                Inquire
              </button>
            </div>
          )}
          {!art.available && (
            <p className="mt-3 font-mono text-[9px] tracking-widest uppercase text-parchment/30">Sold</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPreview() {
  return (
    <section id="gallery" className="py-32 bg-ink relative">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[20rem] font-light text-parchment/[0.02] leading-none select-none pointer-events-none pr-4">
        02
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-gold/60" />
              <span className="font-mono text-[10px] tracking-ultra uppercase text-gold/60" style={{ letterSpacing: "0.35em" }}>
                Selected Works
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-light text-parchment leading-tight">
              The <span className="italic text-gold">Gallery</span>
            </h2>
          </div>
          <p className="font-body text-parchment/40 max-w-sm font-light leading-relaxed text-sm">
            Original works by our resident artists and instructors. Each piece tells a story.
            Hover to explore. <span className="text-gold/60">Purchase inquiries welcome.</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {artworks.map((art, i) => (
            <ArtCard key={art.id} art={art} delay={i * 80} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="font-mono text-[10px] tracking-widest uppercase text-parchment/30 mb-4">
            Full collection available by appointment
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 font-body text-xs tracking-widest uppercase text-gold border-b border-gold/30 pb-0.5 hover:border-gold transition-colors duration-300"
          >
            Schedule a Viewing →
          </a>
        </div>
      </div>
    </section>
  );
}
'''
    
    return component_code

def main():
    print("🎨 更新Luna Art Studio艺术作品画廊...")
    print("=" * 50)
    
    # 检查图片是否存在
    print("\n📸 检查图片文件:")
    for i in range(1, 8):
        path = f"public/images/artworks/artwork{i}.jpg"
        if os.path.exists(path):
            file_size = os.path.getsize(path) / 1024
            print(f"✅ artwork{i}.jpg: {file_size:.1f}KB")
        else:
            print(f"❌ artwork{i}.jpg: 文件不存在")
    
    # 生成组件代码
    print("\n💻 生成GalleryPreview组件...")
    component_code = generate_gallery_component()
    
    # 创建备份
    backup_path = "components/GalleryPreview_backup.tsx"
    if os.path.exists("components/GalleryPreview.tsx"):
        import shutil
        shutil.copy2("components/GalleryPreview.tsx", backup_path)
        print(f"✅ 原始组件已备份到: {backup_path}")
    
    # 保存新组件
    output_path = "components/GalleryPreview.tsx"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(component_code)
    
    print(f"✅ 新组件已保存到: {output_path}")
    
    print("\n" + "=" * 50)
    print("🎉 更新完成！")
    print("\n下一步:")
    print("1. 本地测试: npm run dev")
    print("2. 访问 http://localhost:3000 查看效果")
    print("3. 如果满意，部署到Vercel: vercel --prod")
    print("\n注意: 由于使用了7张图片而不是6张，画廊布局会自动调整")

if __name__ == "__main__":
    main()