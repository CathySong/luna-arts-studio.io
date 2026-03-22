#!/usr/bin/env python3
"""
优化艺术作品图片并生成新的GalleryPreview组件
"""

import os
import json
from PIL import Image

def optimize_images():
    """优化图片大小和质量"""
    input_dir = "public/images/artworks"
    output_dir = "public/images/artworks/optimized"
    
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    optimized_images = []
    
    for i in range(1, 8):  # 我们有7张图片
        input_path = f"{input_dir}/artwork{i}.jpg"
        output_path = f"{output_dir}/artwork{i}_optimized.jpg"
        
        if os.path.exists(input_path):
            try:
                # 打开并优化图片
                with Image.open(input_path) as img:
                    # 转换为RGB模式（确保兼容性）
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    
                    # 调整大小：最大宽度800px，保持宽高比
                    max_size = (800, 800)
                    img.thumbnail(max_size, Image.Resampling.LANCZOS)
                    
                    # 保存优化后的图片
                    img.save(output_path, 'JPEG', quality=85, optimize=True)
                    
                    # 获取图片信息
                    width, height = img.size
                    file_size = os.path.getsize(output_path) / 1024  # KB
                    
                    optimized_images.append({
                        'id': i,
                        'path': f"/images/artworks/optimized/artwork{i}_optimized.jpg",
                        'width': width,
                        'height': height,
                        'size_kb': round(file_size, 1)
                    })
                    
                    print(f"✅ 优化 artwork{i}.jpg: {width}x{height} ({file_size:.1f}KB)")
                    
            except Exception as e:
                print(f"❌ 处理 artwork{i}.jpg 时出错: {e}")
        else:
            print(f"⚠️  文件不存在: {input_path}")
    
    return optimized_images

def analyze_image_colors():
    """分析图片的主要颜色（简化版）"""
    # 基于图片内容分配颜色主题
    color_themes = [
        {
            'name': 'golden',
            'color': 'from-amber-900/40 to-gold/20',
            'accent': '#c9a96e'
        },
        {
            'name': 'sage',
            'color': 'from-sage/30 to-emerald-900/20',
            'accent': '#7a8c7e'
        },
        {
            'name': 'clay',
            'color': 'from-clay/30 to-amber-900/20',
            'accent': '#c4785a'
        },
        {
            'name': 'slate',
            'color': 'from-slate-700/40 to-mist/20',
            'accent': '#9ba8b0'
        },
        {
            'name': 'red',
            'color': 'from-red-900/30 to-amber-700/20',
            'accent': '#d4845a'
        },
        {
            'name': 'blue',
            'color': 'from-blue-900/30 to-cyan-900/20',
            'accent': '#6a9ab0'
        },
        {
            'name': 'purple',
            'color': 'from-purple-900/30 to-violet-900/20',
            'accent': '#8a6bb0'
        }
    ]
    
    return color_themes

def create_artwork_data(optimized_images, color_themes):
    """创建艺术作品数据"""
    # 艺术作品信息（可以根据实际图片内容调整）
    artwork_titles = [
        "Golden Hour",
        "Sage Silence", 
        "Terra Firma",
        "Lunar Drift",
        "Embers",
        "Still Waters",
        "Violet Dreams"
    ]
    
    artwork_mediums = [
        "Oil on Canvas",
        "Watercolor",
        "Acrylic & Charcoal",
        "Ink & Gouache",
        "Oil Pastel",
        "Watercolor",
        "Mixed Media"
    ]
    
    artwork_sizes = [
        "24 × 36 in",
        "18 × 24 in",
        "30 × 40 in",
        "16 × 20 in",
        "12 × 16 in",
        "20 × 28 in",
        "22 × 30 in"
    ]
    
    artwork_years = ["2024", "2024", "2023", "2024", "2023", "2024", "2024"]
    artwork_prices = ["$1,200", "$680", "$1,800", "$540", "$420", "$760", "$890"]
    artwork_availability = [True, False, True, True, False, True, True]
    
    artworks = []
    
    for i, img_info in enumerate(optimized_images):
        color_theme = color_themes[i % len(color_themes)]
        
        artwork = {
            'id': img_info['id'],
            'title': artwork_titles[i],
            'medium': artwork_mediums[i],
            'size': artwork_sizes[i],
            'year': artwork_years[i],
            'color': color_theme['color'],
            'accent': color_theme['accent'],
            'available': artwork_availability[i],
            'price': artwork_prices[i],
            'imagePath': img_info['path'],
            'width': img_info['width'],
            'height': img_info['height']
        }
        
        artworks.append(artwork)
    
    return artworks

def generate_gallery_component(artworks):
    """生成新的GalleryPreview组件代码"""
    component_template = '''"use client";
import { useRef, useState } from "react";
import { useInView } from "@/lib/useInView";
import Image from "next/image";

const artworks = {artworks_data};

function ArtCard({ art, delay }: {{ art: (typeof artworks)[0]; delay: number }}) {{
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {{ threshold: 0.1 }});

  return (
    <div
      ref={{ref}}
      className={`group relative cursor-pointer transition-all duration-700`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${{delay}}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Artwork image */}
      <div className={`relative aspect-[3/4] bg-gradient-to-br ${{art.color}} border border-white/5 overflow-hidden`}>
        <Image
          src={{art.imagePath}}
          alt={{`${{art.title}} - ${{art.medium}}`}}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
          priority={{art.id <= 3}}
        />
        
        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-ink/80 flex flex-col justify-end p-5 transition-all duration-400 ${{hovered ? "opacity-100" : "opacity-0"}}`}
        >
          <p className="font-mono text-[9px] tracking-widest uppercase text-gold/70 mb-1">{{art.medium}}</p>
          <p className="font-display text-xl text-parchment font-light mb-1">{{art.title}}</p>
          <p className="font-mono text-[9px] text-parchment/40">{{art.size}} · {{art.year}}</p>
          {{art.available && (
            <div className="mt-3 flex items-center justify-between">
              <span className="font-body text-sm text-gold font-light">{{art.price}}</span>
              <button className="px-4 py-1.5 border border-gold/40 text-gold font-mono text-[9px] tracking-widest uppercase hover:bg-gold hover:text-ink transition-all duration-300">
                Inquire
              </button>
            </div>
          )}
          {{!art.available && (
            <p className="mt-3 font-mono text-[9px] tracking-widest uppercase text-parchment/30">Sold</p>
          )}
        </div>
      </div>
    </div>
  );
}}

export default function GalleryPreview() {{
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
          {{artworks.map((art, i) => (
            <ArtCard key={{art.id}} art={{art}} delay={{i * 80}} />
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
}}
'''
    
    # 格式化艺术作品数据
    artworks_json = json.dumps(artworks, indent=2)
    
    # 替换模板中的占位符
    component_code = component_template.replace('{artworks_data}', artworks_json)
    
    return component_code

def main():
    print("🎨 开始优化Luna Art Studio艺术作品图片...")
    print("=" * 50)
    
    # 1. 优化图片
    print("\n📸 优化图片:")
    optimized_images = optimize_images()
    
    if not optimized_images:
        print("❌ 没有找到可优化的图片")
        return
    
    # 2. 分析颜色主题
    print("\n🎨 分析颜色主题:")
    color_themes = analyze_image_colors()
    print(f"✅ 生成 {len(color_themes)} 个颜色主题")
    
    # 3. 创建艺术作品数据
    print("\n📝 创建艺术作品数据:")
    artworks = create_artwork_data(optimized_images, color_themes)
    print(f"✅ 创建 {len(artworks)} 个艺术作品条目")
    
    # 4. 生成组件代码
    print("\n💻 生成GalleryPreview组件:")
    component_code = generate_gallery_component(artworks)
    
    # 5. 保存组件文件
    output_path = "components/GalleryPreview_updated.tsx"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(component_code)
    
    print(f"✅ 组件已保存到: {output_path}")
    
    # 6. 创建备份
    backup_path = "components/GalleryPreview_backup.tsx"
    import shutil
    shutil.copy2("components/GalleryPreview.tsx", backup_path)
    print(f"✅ 原始组件已备份到: {backup_path}")
    
    print("\n" + "=" * 50)
    print("🎉 优化完成！")
    print("\n下一步:")
    print("1. 检查 components/GalleryPreview_updated.tsx")
    print("2. 如果满意，替换原文件: mv components/GalleryPreview_updated.tsx components/GalleryPreview.tsx")
    print("3. 测试网站: npm run dev")
    print("4. 部署到Vercel: vercel --prod")

if __name__ == "__main__":
    main()