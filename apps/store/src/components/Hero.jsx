import { Link } from "react-router";
import { FaMagnifyingGlass, FaSliders } from "react-icons/fa6";

export default function Hero() {
  return (
    <section className="w-full bg-fancy text-white">
      <div className="flex flex-col lg:flex-row items-center gap-20 mx-auto w-[min(1200px,92%)] py-10">
        <div className="flex-1 flex flex-col gap-4">
          <p className="uppercase opacity-75 font-bold tracking-widest">&mdash; Fresh plants, fresh vibe</p>
          <h1 className="text-5xl font-bold font-brand">Good mood blooms from inside 🌱</h1>
          <p className="leading-wide py-4">
            Bring fresh energy into your home with curated plants and pots. Our environment, the world in which we live and work, is a mirror of our attitudes and expectations.
          </p>
          <div className="flex gap-2">
            <Link to="/all" className="btn btn-outline-light">
              <FaSliders className="size-5" />
            </Link>
            <input className="border border-white/50 outline-none px-4 w-full rounded-lg focus:border-white" placeholder="Search for products..." />
            <button className="btn btn-cta">
              <FaMagnifyingGlass className="size-5" />
            </button>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-cta btn-jump">Shop now</button>
            <button className="btn btn-outline-light btn-jump">Explore</button>
          </div>
        </div>
        <div className="flex flex-col justify-between overflow-hidden shrink-0 lg:aspect-3/4 w-full lg:w-[350px] bg-cover bg-[url(https://placehold.co/800x400)] shadow-lg/10 rounded-lg">
          <div className="bg-emerald-800 text-white px-3 py-2 w-max rounded-lg font-bold m-4">Featured</div>
          <div className="space-y-4 p-4 bg-linear-to-t from-black/50 to-transparent">
            <div>
              <div className="text-xl font-bold">Monstera Deliciosa</div>
              <div>Lorem ipsum dolor sir amet.</div>
            </div>
            <button className="btn btn-cta btn-jump w-full">Read more</button>
          </div>
        </div>
      </div>
    </section>
  );
}
