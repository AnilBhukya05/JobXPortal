import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code2, Server, BarChart3, Cloud, Palette,
  Globe2, Smartphone, Brain, Bug, ShieldCheck,
  ClipboardList, Megaphone,
} from "lucide-react";

const iconMap = {
  frontend: Code2,
  backend: Server,
  data: BarChart3,
  devops: Cloud,
  design: Palette,
  remote: Globe2,
  mobile: Smartphone,
  "ai-ml": Brain,
  qa: Bug,
  security: ShieldCheck,
  product: ClipboardList,
  marketing: Megaphone,
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function PortalCard({ portal, index = 0 }) {
  const Icon = iconMap[portal.slug] || Globe2;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Link to={"/jobs/" + portal.slug} className="block h-full">
        <motion.div
          whileHover="hover"
          initial="rest"
          animate="rest"
          className="relative bg-[#12151D] border border-[#1E2330] rounded-2xl p-5 md:p-7 h-full overflow-hidden group cursor-pointer"
        >
          {/* ANIMATED BACKGROUND GLOW */}
          <motion.div
            variants={{
              rest: { opacity: 0, scale: 0.8 },
              hover: { opacity: 1, scale: 1.4 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 bg-[#10B981]/5 rounded-2xl pointer-events-none"
          />

          {/* BORDER GLOW */}
          <motion.div
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-2xl border border-[#10B981]/40 pointer-events-none"
          />

          {/* TOP ROW */}
          <div className="flex items-center justify-between mb-4 md:mb-6 relative z-10">
            <span className="font-mono text-[10px] md:text-xs tracking-widest text-[#8A8F9C]">
              GATE {portal.gate}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] md:text-xs text-[#2DD4BF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              LIVE
            </span>
          </div>

          {/* ICON */}
          <div className="flex justify-center mb-4 md:mb-5 relative z-10">
            <motion.div
              variants={{
                rest: { scale: 1, rotate: 0 },
                hover: { scale: 1.15, rotate: -5 },
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Icon size={36} className="text-[#10B981] md:w-12 md:h-12" />
            </motion.div>
          </div>

          {/* TEXT */}
          <h3 className="text-base md:text-xl font-bold text-center text-[#F5F3EE] relative z-10">
            {portal.name}
          </h3>
          <p className="text-[#8A8F9C] text-xs md:text-sm text-center mt-2 relative z-10">
            {portal.description}
          </p>

          {/* VIEW JOBS */}
          <motion.div
            variants={{
              rest: { opacity: 0.6, y: 4 },
              hover: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.25 }}
            className="mt-4 md:mt-6 text-center font-mono text-xs md:text-sm text-[#10B981] relative z-10"
          >
            VIEW JOBS →
          </motion.div>

          {/* SHIMMER LINE AT BOTTOM */}
          <motion.div
            variants={{
              rest: { scaleX: 0, opacity: 0 },
              hover: { scaleX: 1, opacity: 1 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent origin-left"
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}