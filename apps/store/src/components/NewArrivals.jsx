const imgs = [
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551892374-ecf8754cf8f5?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1586861203927-8009e4a1c6e6?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524594154908-edd406d4f4a5?q=80&w=1200&auto=format&fit=crop',
];

export default function NewArrivals() {
  return (
    <div className="grid-4">
      {imgs.map((src, i) => (
        <div key={i} className="photo">
          <img alt={'New arrival ' + (i + 1)} src={src} />
        </div>
      ))}
    </div>
  );
}
