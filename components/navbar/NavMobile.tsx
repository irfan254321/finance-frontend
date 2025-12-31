import { motion, AnimatePresence } from "framer-motion";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Divider } from "@mui/material";
import { useRouter } from "next/navigation";

interface NavMobileProps {
  isOpen: boolean;
  openMenu: string | null;
  toggleMenu: (menu: string) => void;
  // Data props
  financeItems: any[];
  manageItems: any[];
  years: number[];
  user: any;
  logout: () => void;
  onClose: () => void;
}

export default function NavMobile({
  isOpen,
  openMenu,
  toggleMenu,
  financeItems,
  manageItems,
  years,
  user,
  logout,
  onClose,
}: NavMobileProps) {
  const router = useRouter();

  // Helper untuk navigasi dan tutup menu
  const navigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const menuGroups = [
    { title: "Finance", key: "finance", items: financeItems, type: "finance" },
    { title: "Manage", key: "manage", items: manageItems, type: "manage" },
    
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 right-0 w-[80%] h-[calc(100vh-80px)] bg-gradient-to-b from-[#1a2732]/97 via-[#2C3E50]/96 to-[#1a2732]/97 border-l border-[#EBD77A]/15 p-6 flex flex-col gap-4 text-[#EBD77A] overflow-y-auto"
        >
          {/* Loop Finance & Manage */}
          {menuGroups.map((group) => (
            <div key={group.title}>
              <button
                onClick={() => toggleMenu(group.key)}
                className="flex justify-between items-center w-full text-left text-lg font-semibold hover:text-[#FFD970]"
              >
                {group.title}
                {openMenu === group.key ? <ExpandLess /> : <ExpandMore />}
              </button>

              <AnimatePresence>
                {openMenu === group.key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-4 mt-2 space-y-3 text-sm"
                  >
                    {group.items.map((item: any) => (
                      <div key={item.label}>
                        <span className="font-semibold text-[#FFD970]">
                          {item.label}
                        </span>
                        <div className="ml-4 mt-1 space-y-1">
                          {/* Logic Finance: Loop Years */}
                          {group.type === "finance" &&
                            years.map((y) => (
                              <button
                                key={y}
                                onClick={() => navigate(`${item.route}/${y}`)}
                                className="block text-left hover:text-[#FFD970] text-[#F4E1C1]"
                              >
                                📆 {y}
                              </button>
                            ))}

                          {/* Logic Manage: Loop Routes */}
                          {group.type === "manage" &&
                            item.routes.map((r: any) => (
                              <button
                                key={r.name}
                                onClick={() => {
                                   if (typeof r.path === 'string') navigate(r.path);
                                   else { r.path(); onClose(); } // handle logout func
                                }}
                                className="block text-left hover:text-[#FFD970] text-[#F4E1C1]"
                              >
                                {r.name}
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          
          {/* Static Register Button (Khusus Admin) - Hardcoded karena simple */}
          <button
             onClick={() => navigate("/dashboard/admin/register")}
             className="flex justify-between items-center w-full text-left text-lg font-semibold hover:text-[#FFD970]"
           >
             Register
           </button>

          <Divider className="!border-[#EBD77A]/20 my-4" />

          {user && (
            <>
              <button
                onClick={() => navigate("/dashboard/profile")}
                className="text-left text-lg hover:text-[#FFD970]"
              >
                📁 Profile
              </button>
              <button
                onClick={() => { logout(); }}
                className="text-left text-lg hover:text-[#FFD970]"
              >
                🚪 Logout
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}