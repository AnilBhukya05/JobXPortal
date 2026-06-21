import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code2,
  Server,
  BarChart3,
  Cloud,
  Palette,
  Globe2,
  Smartphone,
  Brain,
  Bug,
  ShieldCheck,
  ClipboardList,
  Megaphone,
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

export default function PortalCard({ portal }) {
  const Icon = iconMap[portal.slug] || Globe2;

  return (
    <Link to={"/jobs/" + portal.slug}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        className="relative bg-[#12151D] border border-[#1E2330] rounded-2xl p-7 hover:border-[#FFB020]/60 transition-colors duration-300 group"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-xs tracking-widest text-[#8A8F9C]">
            GATE {portal.gate}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-xs text-[#2DD4BF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
            LIVE
          </span>
        </div>

        <div className="flex justify-center mb-5">
          <Icon size={48} className="text-[#FFB020]" />
        </div>

        <h3 className="text-xl font-bold text-center text-[#F5F3EE]">
          {portal.name}
        </h3>
        <p className="text-[#8A8F9C] text-sm text-center mt-2">
          {portal.description}
        </p>

        <div className="mt-6 text-center font-mono text-sm text-[#FFB020] group-hover:underline">
          VIEW JOBS
        </div>
      </motion.div>
    </Link>
  );
}