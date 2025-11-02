import clsx from "clsx";
import { Link } from "react-router";

export default function Promo({ title, desc, btnTitle, btnUrl, className, Icon }) {
  return (
    <section className={clsx("overflow-hidden relative rounded-lg p-8 my-8 shadow-lg/5", className)}>
      <div className="relative z-10 flex flex-col gap-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p>{desc}</p>
        <Link className="btn btn-cta btn-jump shadow-lg/10 w-max" to={btnUrl}>
          {btnTitle}
        </Link>
      </div>
      <Icon className="size-50 absolute -bottom-5 right-10 opacity-20 pointer-events-none" />
    </section>
  );
}
