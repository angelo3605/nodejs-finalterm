import { FaArrowRight } from "react-icons/fa6";

export function Section({ title, onMore, children }) {
  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-emerald-700 py-8">{title}</h2>
        {
          onMore && <button onClick={onMore} className="btn btn-outline-dark">
            View all
            <FaArrowRight />
          </button>
        }
      </div>
      <div>{children}</div>
    </section>
  );
}
