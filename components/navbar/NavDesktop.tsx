import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "@mui/icons-material";

// --- Sub Components untuk Desktop ---

// Item Dropdown Utama (Finance / Manage)
interface DesktopDropdownProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface MenuButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean; // Tambahan prop
}



export const DesktopDropdown = ({ label, isOpen, onToggle, children }: DesktopDropdownProps) => (
  <div className="relative">
    <button
      onClick={onToggle}
      className={`relative group px-2 font-semibold cursor-pointer select-none transition-all ease-out ${
        isOpen
          ? "text-[#FFD970] drop-shadow-[0_0_6px_rgba(255,217,112,0.4)]"
          : "text-[#EBD77A]"
      }`}
    >
      {label}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="absolute left-0 mt-3 min-w-[240px] bg-gradient-to-br from-[#1a2732]/98 via-[#2C3E50]/96 to-[#1a2732]/98 border border-[#EBD77A]/25 rounded-xl shadow-[0_8px_25px_rgba(235,215,122,0.15)] p-3 space-y-1"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Item List di dalam Dropdown (yang punya panah ke kanan)
interface DropdownItemProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const DropdownSubItem = ({ label, isOpen, onToggle, children }: DropdownItemProps) => (
  <div className="relative group">
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full text-left px-3 py-2 text-[#EDE3B5] font-medium rounded-lg hover:bg-white/5 hover:text-[#FFD970]"
    >
      {label}
      <ChevronRight
        className={`transition-transform ${
          isOpen ? "rotate-90 text-[#FFD970]" : "text-[#EBD77A]/70"
        }`}
        fontSize="small"
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-0 left-full ml-3 min-w-[200px] bg-gradient-to-br from-[#1a2732]/98 via-[#2C3E50]/96 to-[#1a2732]/98 border border-[#EBD77A]/25 rounded-xl p-2 space-y-1"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Link Sederhana di level paling dalam
interface MenuLinkProps {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}

export const MenuLink = ({ href, onClick, children }: MenuLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className="block w-full text-left px-3 py-1.5 text-xl text-[#F6F1D3] hover:text-[#FFD970] hover:bg-white/10 rounded-md"
  >
    {children}
  </Link>
);

// Button Sederhana (untuk Logout dsb)
export const MenuButton = ({
  onClick,
  children,
  disabled,
  isLoading = false,
}: MenuButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`relative block w-full text-left px-3 py-1.5 text-xl rounded-md transition-all
      ${
        disabled || isLoading
          ? "text-[#FFD970] bg-white/10 cursor-not-allowed"
          : "text-[#F6F1D3] hover:text-[#FFD970] hover:bg-white/10"
      }`}
  >
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 5 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-3"
        >
          <motion.div className="w-4 h-4 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
          LOGGING OUT...
        </motion.div>
      ) : (
        <motion.span
          key="normal"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 5 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  </button>
);