import { api } from "@mint-boutique/axios-client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export function Catalog() {
  const { isPending, data: { categories } = {} } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((res) => res.data),
  });

  const navigate = useNavigate();

  if (isPending) {
    return "Loading...";
  }

  return (
    <>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-8">
        {categories.map((cat) => (
          <button onClick={() => navigate(`/${cat.slug}`)} className="group flex flex-col shadow-xl/5 rounded-xl overflow-hidden cursor-pointer">
            <div className="aspect-4/3 relative">
              <img src="https://placehold.co/400x300" className="object-cover" />
              <div className="absolute inset-0 bg-white/50 scale-y-0 group-hover:scale-y-100 transition p-4">
                <span>Description</span>
                <hr className="mx-8 my-2 opacity-33" />
                <p>{cat.desc}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 h-full">
              <span className="text-start">{cat.name}</span>
              <button className="font-bold self-end h-10 px-4 bg-emerald-50 text-emerald-700 rounded-xl shadow-lg/5">All</button>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
