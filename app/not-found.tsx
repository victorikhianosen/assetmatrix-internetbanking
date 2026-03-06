"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden px-6">

      {/* Glow background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-125 h-125 bg-primary/30 blur-[120px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full text-center text-white animate-fadeIn">

        {/* Logo */}
        <div className="flex justify-center mb-8 opacity-90">
          <Image
            src="/assets/images/logo.png"
            alt="Logo"
            width={200}
            height={80}
            className="h-12"
          />
        </div>

        {/* Animated 404 */}
        <h1 className="text-[96px] font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/50 animate-float">
          404
        </h1>

        <h2 className="text-xl font-semibold mt-2">
          Page not found
        </h2>

        <p className="text-sm text-secondary/40 mt-3 mb-8">
          Looks like you followed a broken link or the page was moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/login")}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold transition transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30"
          >
            Go to Login
          </button>

          <button
            onClick={() => router.back()}
            className="w-full py-3 rounded-xl border border-white/90 text-white hover:text-black transition hover:bg-white/80"
          >
            Go Back
          </button>
        </div>

        <p className="mt-6 text-xs text-secondary/50">
          Error code: 404 • Not found
        </p>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}