"use client";

import { motion } from "framer-motion";

export default function SideBar() {
  return (
    <div
      className="hidden lg:flex w-1/2 relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 40%, #EE8520 100%)",
      }}>
      {/* subtle light sweep */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: ["-40%", "120%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,.05), transparent)",
        }}
      />
      {/* CONTENT */}
      <div className="relative z-10 px-20 pt-25 w-[95%]">
        {/* HEADLINE */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-[58px] font-extrabold leading-[1.1] mb-10 tracking-tight">
          Banking Made
          <br />
          Simple & Secure
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-lg text-white/80 mb-10 leading-relaxed">
          Access your account, manage transactions, and monitor your finances anytime, anywhere with
          confidence.
        </motion.p>

        {/* FEATURE TAGS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap gap-3 text-sm font-semibold">
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur">
            🔐 Secure Transactions
          </span>
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur">
            ⚡ Fast Processing
          </span>
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur">
            💸 Trusted Microfinance
          </span>
        </motion.div>

        {/* FOOTER */}
        <div className="mt-24 text-sm text-white/60">
          © {new Date().getFullYear()} Asset Matrix Microfinance Bank. All rights reserved.
        </div>
      </div>
    </div>
  );
}
