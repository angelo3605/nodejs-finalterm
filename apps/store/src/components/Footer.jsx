import Logo from "@mint-boutique/assets/logo.svg?react";
import { FaClock, FaStore } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-emerald-50 text-emerald-900 mt-auto">
      <div className="mx-auto w-[min(1200px,92%)] *:h-[200px] flex justify-between items-center py-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 group text-xl mb-4">
            <Logo className="size-8 group-hover:animate-spin" />
            <span className="font-brand">Mint Boutique</span>
          </div>
          <p className="flex items-center gap-2">
            <FaStore /> 123 Green St, District 1, HCMC
          </p>
          <p className="flex items-center gap-2">
            <FaClock /> Open daily 9:00 &mdash; 21:00
          </p>
          <div className="mt-auto">&copy; {new Date().getFullYear()} Plantly. All rights reserved.</div>
        </div>
        <iframe
          title="Map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5020302486343!2d106.700!3d10.772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f4a9f62ad%3A0x1b7b7d5af2!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2sVN!4v1680000000000"
          allowFullScreen
          className="w-[400px] rounded-lg"
        ></iframe>
      </div>
    </footer>
  );
}
