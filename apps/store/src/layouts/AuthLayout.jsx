import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router";
import { UnsplashCredit } from "@/components/Credit";

export default function AuthLayout({ title, desc, children, backTitle, backUrl }) {
  return (
    <div className="grid lg:grid-cols-[auto_500px]">
      <div className="relative max-lg:aspect-video size-full lg:h-screen">
        <img src={`${import.meta.env.VITE_API_URL}/images/bg-cover.jpg`} className="size-full object-cover" />
        <UnsplashCredit
          photographerName="Ceyda Çiftci"
          photographerUrl="https://unsplash.com/@ceydaciftci?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          imageUrl="https://unsplash.com/photos/green-potted-plants-on-brown-wooden-seat-dDVU6D_6T80?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
        />
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
