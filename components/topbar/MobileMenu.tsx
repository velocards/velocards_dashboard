"use client";
import { useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import ModeSwitcher from "./ModeSwitcher";
import BalanceDisplay from "./BalanceDisplay";
import { motion, AnimatePresence } from "framer-motion";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Mobile menu"
      >
        {isOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
      </button>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="sm:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="sm:hidden fixed right-0 top-0 h-full w-72 bg-white dark:bg-bg4 shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-4">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Menu</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <IconX size={20} />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="space-y-4">
                  {/* Balance Display */}
                  <div className="border-b dark:border-n500 pb-4">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Account Balance
                    </h4>
                    <BalanceDisplay />
                  </div>

                  {/* Theme Switcher */}
                  <div className="border-b dark:border-n500 pb-4">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Theme
                    </h4>
                    <div className="flex justify-start">
                      <ModeSwitcher />
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Quick Links
                    </h4>
                    <nav className="space-y-2">
                      <a
                        href="/settings/profile"
                        className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        My Profile
                      </a>
                      <a
                        href="/cards"
                        className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        My Cards
                      </a>
                      <a
                        href="/transactions"
                        className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Transactions
                      </a>
                      <a
                        href="/support/help-center"
                        className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Help & Support
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMenu;