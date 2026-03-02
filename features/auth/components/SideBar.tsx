"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SideBar() {
  return (
    <div
      className="hidden lg:flex w-1/2 relative overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(135deg, #1f2731 0%, #29333f 50%, #3b4757 100%)",
      }}
    >
      {/* moving light sweep */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: ["-40%", "120%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent)",
        }}
      />

      {/* LOGO — TOP LEFT */}
      <Link href="/login" className="absolute top-10 left-14 z-10 cursp">
        <img
          src="/assets/images/logo.png"
          alt="Pakasso"
          className="h-12 object-contain"
        />
      </Link>

      {/* CONTENT */}
      <div className="relative z-10 px-20 pt-36 max-w-xl">

        {/* BIG ENERGY TEXT */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-[64px] font-extrabold leading-[1.05] mb-6 tracking-tight"
        >
          Your money.
          <br />
          Your rules.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-xl text-white/80 mb-12"
        >
          Move cash. Pay fast. Stay in control.
        </motion.p>

        {/* GEN Z TAGS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap gap-3 text-sm font-semibold"
        >
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur">
            ⚡ instant
          </span>
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur">
            🔐 secure
          </span>
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur">
            💸 flexible
          </span>
        </motion.div>

        {/* FOOTER */}
        <div className="mt-24 text-sm text-white/60">
          Built for the next generation of money.
        </div>
      </div>
    </div>
  );
}
