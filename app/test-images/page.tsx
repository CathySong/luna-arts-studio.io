export default function TestImagesPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>测试图片访问</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
            <h3>artwork{i}.jpg</h3>
            <img 
              src={`/images/artworks/artwork${i}.jpg`} 
              alt={`Artwork ${i}`}
              style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
                (e.target as HTMLImageElement).alt = '图片加载失败';
              }}
            />
            <p>路径: /images/artworks/artwork{i}.jpg</p>
          </div>
        ))}
      </div>
    </div>
  );
}