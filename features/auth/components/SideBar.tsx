"use client";

import { motion } from "framer-motion";

export default function SideBar() {
  return (
    <div
      className="hidden lg:flex w-full h-screen relative overflow-hidden text-white flex-col justify-between"
      style={{
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 40%, #EE8520 100%)",
      }}
    >
      {/* subtle light sweep */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: ["-40%", "120%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,.05), transparent)",
        }}
      />

      {/* TOP CONTENT */}
      <div className="relative z-10 px-20 pt-25 w-[95%]">

        {/* HEADLINE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-6 mb-10"
        >
          <h1 className="text-[160px] font-extrabold tracking-tight leading-none">
            Move
          </h1>

          <div className="flex flex-col gap-3">

            <span className="bg-[#EE8520] text-white px-9 py-2 rounded-lg text-[22px] font-bold tracking-wide w-fit">
              MONEY
            </span>

          <span className="flex items-center justify-between border-2 border-white/70 rounded-full px-6 py-2 text-[22px] font-bold w-[150px]">
  LIFE
  <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white/70 text-[16px]">
    ❤️
  </span>
</span>

          </div>
        </motion.div>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-lg text-white/80 mb-10 leading-relaxed"
        >
          Access your account, manage transactions, and monitor your finances
          anytime, anywhere with confidence.
        </motion.p>

        {/* FEATURE TAGS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap gap-3 text-sm font-semibold"
        >
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur">
          ⚡ Transfer
          </span>
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur">
            ⚡ Top-Up
          </span>
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur">
            ⚡ Save
          </span>
           <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur">
            ⚡ Invest
          </span>
        </motion.div>

      </div>

      {/* FOOTER */}
      <div className="relative z-10 px-20 pb-10 text-sm text-white/60">
        © {new Date().getFullYear()} Asset Matrix Microfinance Bank. All rights reserved.
      </div>
    </div>
  );
}