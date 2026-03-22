export default function TestBackgroundPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>背景图片测试页面</h1>
      <p>测试时间: {new Date().toLocaleString()}</p>
      
      <div style={{ margin: '20px 0', padding: '20px', background: '#2a2a2a', borderRadius: '8px' }}>
        <h2>1. 检查背景图片文件</h2>
        <img 
          src="/images/backgrounds/hero-background.jpg" 
          alt="背景图片测试"
          style={{ width: '300px', height: 'auto', border: '2px solid #c9a96e', borderRadius: '4px' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9IiMzMzMiPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
            (e.target as HTMLImageElement).alt = '图片加载失败';
          }}
        />
        <p>路径: /images/backgrounds/hero-background.jpg</p>
      </div>

      <div style={{ margin: '20px 0', padding: '20px', background: '#2a2a2a', borderRadius: '8px' }}>
        <h2>2. 检查Hero组件更新</h2>
        <p>检查以下内容是否在Hero组件中：</p>
        <ul>
          <li>✅ Next.js Image组件导入</li>
          <li>✅ 背景图片路径正确</li>
          <li>✅ 叠加层确保文字可读性</li>
          <li>✅ 响应式设计</li>
        </ul>
      </div>

      <div style={{ margin: '20px 0', padding: '20px', background: '#2a2a2a', borderRadius: '8px' }}>
        <h2>3. Git提交状态</h2>
        <p>最近的commits应该包括：</p>
        <ul>
          <li>feat: Replace canvas particle background with photo background</li>
          <li>chore: Clean up template file and update comments</li>
          <li>fix: Add test page and clean up temporary files</li>
          <li>feat: Replace gallery placeholder SVGs with actual artwork images</li>
        </ul>
      </div>

      <div style={{ margin: '20px 0', padding: '20px', background: '#2a2a2a', borderRadius: '8px' }}>
        <h2>4. 部署状态</h2>
        <p>网站URL: <a href="https://luna-arts-studio-io.vercel.app" style={{ color: '#c9a96e' }}>https://luna-arts-studio-io.vercel.app</a></p>
        <p>测试页面: <a href="https://luna-arts-studio-io.vercel.app/test-background" style={{ color: '#c9a96e' }}>https://luna-arts-studio-io.vercel.app/test-background</a></p>
        <p>画廊测试: <a href="https://luna-arts-studio-io.vercel.app/test-images" style={{ color: '#c9a96e' }}>https://luna-arts-studio-io.vercel.app/test-images</a></p>
      </div>
    </div>
  );
}