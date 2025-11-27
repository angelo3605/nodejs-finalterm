import { api } from "@mint-boutique/axios-client";
import { UnsplashCredit } from "@/components/Credit";

export function About() {
  return (
    <>
      <div className="relative h-[300px]">
        <video className="w-full h-full object-cover" src={`${api.defaults.baseURL}/videos/about-bg.mp4`} autoPlay loop muted playsInline />
        <div className="absolute inset-0 bg-black/30 text-white flex flex-col items-center justify-center gap-4 text-shadow-lg">
          <h1 className="text-5xl font-brand">Mint Boutique</h1>
          <p className="text-xl italic">Bring Nature Home</p>
        </div>
        <UnsplashCredit
          photographerName="cottonbro studio"
          site="Pexels"
          imageUrl="https://www.pexels.com/video/a-close-up-of-a-bouquet-of-flowers-4269183/"
          photographerUrl="https://www.pexels.com/@cottonbro/"
          type="Video"
        />
      </div>
      <main className="mx-auto w-[min(1200px,92%)] flex flex-col items-center">
        <p className="prose dark:prose-invert my-10 text-justify max-w-[800px]">
          <h2>Our story</h2>
          <p>
            <span className="font-brand text-lg">Mint Boutique</span> started as a tiny corner in a sunlit apartment, surrounded by soil, morning light, and a dangerously growing collection of pots.
            What began as a personal passion for greenery quickly blossomed into a mission: to help people bring the joy of living plants into their homes. We curate plants that thrive, design spaces
            that inspire, and make caring for greenery approachable for everyone &mdash; from the first-time plant parent to the seasoned gardener.
          </p>
          <h2>What we stand for</h2>
          <p>
            We believe every plant deserves a good home. That’s why we source only quality plants from trusted growers, provide honest and easy-to-follow care instructions, and adopt sustainable
            practices whenever possible &mdash; from recycled packaging to locally sourced pots. Our team is always ready to guide you, before and after your purchase, because plant care is better
            when you’re never alone. At <span className="font-brand text-lg">Mint Boutique</span>, we don’t just sell plants; we help them, and you, flourish.
          </p>
          <h2>How we care</h2>
          <p>
            Each plant is hand-selected for quality, inspected for healthy roots, and carefully prepped for travel. We pack with care, using humidity packs, soil protection, and sturdy boxes to ensure
            your plant arrives vibrant and ready to thrive. Our delivery partners understand that plants aren’t just parcels &mdash; they’re living companions, and we treat them as such.
          </p>
          <h2>Our space</h2>
          <p>
            Step inside our greenhouse and you’ll find a warm, leafy chaos that feels alive. Pots of every shape and size share the tables with thriving ferns, succulents, and blooming flowers. It’s a
            little messy, very green, and utterly inspiring &mdash; the perfect reflection of our philosophy: plants first, perfection second.
          </p>
          <h2>Customer love</h2>
          <ul>
            <li>
              <em>"The roses I bought last month are still blooming beautifully — and the care guide was so helpful!"</em> &mdash; Thanh
            </li>
            <li>
              <em>"Fast delivery, healthy plants, and friendly advice. My apartment feels alive."</em> &mdash; Linh
            </li>
            <li>
              <em>"Mint Boutique makes plant shopping feel personal and fun."</em> &mdash; Hieu
            </li>
          </ul>
          <h2>Join the journey</h2>
          <p>
            Follow our care guides, attend a workshop, or subscribe to our newsletter. Whether you’re nurturing a tiny succulent or planning a home jungle, we’re here to grow with you. Let’s grow
            something beautiful together. &#x1FAB4;
          </p>
        </p>
      </main>
    </>
  );
}
