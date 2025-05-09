"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleGuard({ allowedRoles, children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.replace("/login");
            return;
        }

        fetch("http://localhost:8000/api/me", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then((data) => {
                console.log("User data:", data.data); // 👈 add this
                setUser(data.data);
            })
            .catch(() => router.replace("/login"))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) return null;

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return children;
}