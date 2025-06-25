"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const {user} = useUser();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Logout failed", err);
    }

    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-[#543310] text-white px-6 py-4 flex items-center justify-between">
      {/* Tombol Burger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md cursor-pointer transition-transform transform hover:scale-105 "
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Logo dan Info User */}
      <div className="flex items-center space-x-4 cursor-pointer" onClick={() => router.push("/")}>
        <span className="text-sm font-medium">
          {user ? `${user.first_name} ${user.last_name}` : "Guest"}
        </span>
        <Image src="/Logo.svg" alt="Logo" width={8} height={8} className="h-8 w-8" />
      </div>

      {/* Sidebar */}
      {isOpen && (
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          exit={{ x: -250 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-full w-64 bg-l-brown/20 text-white backdrop-blur-md shadow-lg p-6 z-10"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-white cursor-pointer transition-transform transform hover:scale-105 rounded-md"
          >
            <X size={24} />
          </button>
          <ul className="mt-6 space-y-4">
            <li
              className="hover:text-gray-300 cursor-pointer"
              onClick={() => router.push("/")}
            >
              Home
            </li>
            <li
              className="hover:text-gray-300 cursor-pointer"
              onClick={() => router.push("/acara")}
            >
              Acara
            </li>
            <li
              className="hover:text-gray-300 cursor-pointer"
              onClick={() => router.push("/diskusi")}
            >
              Forum Diskusi
            </li>
            <li
              className="hover:text-red-400 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
