import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router";

export default function AuthLayout({ title, desc, children, backTitle, backUrl }) {
  return (
    <div className="grid lg:grid-cols-[auto_500px]">
      <div className="relative max-lg:aspect-video size-full lg:h-screen">
        <img src={`${import.meta.env.VITE_API_URL}/images/bg-cover.jpg`} className="size-full object-cover" />
        <p className="flex flex-col sm:flex-row sm:gap-2 *:flex *:gap-2 absolute right-4 bottom-4 px-4 py-2 rounded-lg shadow-lg/50 overflow-hidden backdrop-blur-sm bg-white/75 dark:bg-gray-900/75 font-bold">
          <span>
            Photo by
            <a className="link" href="https://unsplash.com/@ceydaciftci?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Ceyda Çiftci
            </a>
          </span>
          <span>
            on
            <a className="link" href="https://unsplash.com/photos/green-potted-plants-on-brown-wooden-seat-dDVU6D_6T80?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Unsplash
            </a>
          </span>
        </p>
      </div>
      <div className="flex flex-col justify-center gap-4 p-8">
        {backTitle && backUrl && (
          <Link className="link" to={backUrl}>
            <FaArrowLeft /> {backTitle}
          </Link>
        )}
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="opacity-75">{desc}</p>
        {children}
      </div>
    </div>
  );
}
