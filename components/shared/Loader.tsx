"use client";

import Image from "next/image";

type Props = {
  show: boolean;
};

export default function Loader({ show }: Props) {
  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="
                fixed inset-0 z-9999
                flex items-center justify-center
                bg-black/50
                pointer-events-auto
            ">
      <div className="bg-white dark:bg-white rounded-xl shadow-xl p-8 w-full max-w-sm text-center relative">
        {/* LOGO + PING */}
        <div className="flex justify-center mb-6 pt-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* ping ring */}
            <span className="absolute inline-flex w-full h-full rounded-full bg-primary/80 opacity-75 animate-ping"></span>

            {/* logo ring */}
            <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center bg-white dark:bg-[#0f172a] relative z-10">
              <Image src="/assets/images/logo.png" alt="Logo" width={50} height={50} className="w-8 h-8 object-contain" />
            </div>
          </div>
        </div>

        {/* TEXT */}
        <p className="text-sm font-medium text-gray-700 dark:text-black mb-2">Loading....</p>

        {/* DOT LOADER */}
        <div
          className="flex justify-center space-x-1 text-3xl font-bold
                                text-black dark:text-black">
          <span className="animate-bounce [animation-delay:-0.3s]">.</span>
          <span className="animate-bounce [animation-delay:-0.15s]">.</span>
          <span className="animate-bounce">.</span>
        </div>
      </div>
    </div>
  );
}
