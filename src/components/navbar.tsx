"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-d-brown text-white px-6 py-4 flex items-center justify-between">
      {/* Tombol Burger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md cursor-pointer transition-transform transform hover:scale-105 "
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Logo dan Info User */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">John Doe</span>
        <img src="/Logo.svg" alt="Logo" className="h-8 w-8" />
      </div>

      {/* Sidebar */}
      {isOpen && (
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          exit={{ x: -250 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-full w-64 bg-l-brown/20 text-white backdrop-blur-md shadow-lg p-6 "
        >
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-white hover:bg-yellow-900 rounded-md"
          >
            <X size={24} />
          </button>
          <ul className="mt-6 space-y-4">
            <li className="hover:text-gray-300 cursor-pointer">
              Informasi Zakat
            </li>
            <li className="hover:text-gray-300 cursor-pointer">Acara</li>
            <li className="hover:text-gray-300 cursor-pointer">
              Forum Diskusi
            </li>
            <li className="hover:text-red-400 cursor-pointer">Logout</li>
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
