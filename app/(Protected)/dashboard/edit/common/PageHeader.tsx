import { motion } from "framer-motion";

export default function PageHeader({ title, description }: { title: string, description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12"
    >
      <h1 className="text-5xl md:text-6xl font-extrabold text-[#FFD700] drop-shadow-[0_2px_10px_rgba(255,215,0,0.2)]">
        {title}
      </h1>
      <p className="text-gray-300 mt-4 text-lg max-w-3xl mx-auto">{description}</p>
      <div className="w-28 h-[4px] bg-gradient-to-r from-[#2C3E50] to-[#FFD700] mx-auto mt-6 rounded-full" />
    </motion.div>
  );
}