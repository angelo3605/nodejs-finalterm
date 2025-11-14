import { Link } from "react-router";
import { Game } from "@/components/Game";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <h1 className="font-bold text-5xl">404</h1>
      <p className="text-xl">Not found</p>
      <Link to="/" className="btn btn-outline-dark dark:btn-outline-light">
        Return to home
      </Link>
      <Game />
    </div>
  );
}
