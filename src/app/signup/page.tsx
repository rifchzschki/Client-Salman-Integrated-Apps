'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
    });

    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch("http://localhost:8000/api/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (res.ok) router.replace('/');
            })
            .catch(() => {});
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch("http://localhost:8000/api/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            localStorage.setItem('token', data.data.access_token);
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <main className="w-screen h-screen bg-cream flex items-center justify-center overflow-hidden">
            <div className="relative w-[75vw] h-[80vh] bg-bonewhite rounded-4xl flex items-center justify-end overflow-hidden">
                <img src="/masjid-salman-itb.jpg" alt="" className="absolute min-w-[100%] min-h-[100%] object-cover z-0"/>
                <div className="absolute w-[35%] h-[95%] flex flex-col gap-4 items-center justify-start bg-bonewhite z-10 m-4 rounded-3xl overflow-auto px-4 pt-6">
                    <div className="flex justify-start items-start w-full pl-4">
                        <img src="/logo-salman.svg" className="w-17 h-17"/>
                    </div>
                    <h1 className="text-3xl text-black">Sign up</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center justify-center w-full">
                        {["first_name", "last_name", "email", "password", "confirm_password"].map((field) => (
                            <input
                                key={field}
                                type={field.toLowerCase().includes("password") ? "password" : "text"}
                                name={field}
                                placeholder={field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                                value={(form as any)[field]}
                                onChange={handleChange}
                                className="w-[80%] h-12 px-3 border-2 border-d-brown rounded-lg placeholder-d-brown font-medium bg-transparent outline-none"
                            />
                        ))}
                        {error && <p className="text-red-600">{error}</p>}
                        <button
                            type="submit"
                            className="w-[80%] h-12 bg-l-brown font-medium text-bonewhite rounded-lg mt-2 hover:bg-l2-brown"
                        >
                            Register
                        </button>
                    </form>
                    <p className="text-black">Sudah punya akun? <a href="/login" className="text-d-brown">Login</a></p>
                </div>
            </div>
        </main>
    );
}
