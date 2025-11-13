import { FaArrowRight } from "react-icons/fa6";

export function Section({ title, onMore, children, id }) {
  return (
    <section {...(id ? { id } : {})}>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 py-8">{title}</h2>
        {onMore && (
          <button onClick={onMore} className="btn btn-outline-dark dark:btn-outline-light">
            View all
            <FaArrowRight />
          </button>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}
