"use client";

import React, { useEffect, useState } from "react";
import { User, UserContext } from "./UserContext";
import { usePathname, useRouter } from "next/navigation";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuthenticationPage = pathname === "/login" || pathname === "/signup";

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        }
      } catch (err) {
        if (!isAuthenticationPage) {
          console.error("Failed to fetch user", err);
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && isAuthenticationPage) {
      router.replace("/");
      setLoading(false);
      return;
    }

    if (!token && !isAuthenticationPage) {
      router.replace("/login");
      setLoading(false);
      return;
    }

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  if (loading) return <div>Loading ...</div>

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};
