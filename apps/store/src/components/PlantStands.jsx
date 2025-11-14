export default function PlantStands() {
  return (
    <div className="grid-2">
      <div className="stand-card">
        <img
          alt="Macrame hanging pot"
          src="https://images.unsplash.com/photo-1520881363902-a0ff4e722963?q=80&w=1200&auto=format&fit=crop"
        />
        <div className="stand-meta">
          <h3>Hanging macramé</h3>
          <p>Handmade cotton plant hanger for a cozy corner.</p>
        </div>
      </div>
      <div className="stand-card">
        <img
          alt="Minimal plant stand"
          src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop"
        />
        <div className="stand-meta">
          <h3>Minimal stand</h3>
          <p>Powder-coated steel stand that fits most pots.</p>
        </div>
      </div>
    </div>
  );
}
