'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
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
                <img src="/masjid-salman-itb.jpg" alt="" className="absolute min-w-[100%] min-h-[100%] object-cover z-0" />
                <div className="absolute w-[35%] h-[95%] flex flex-col items-center justify-start bg-bonewhite z-10 m-4 rounded-3xl overflow-auto">
                    <div className="flex justify-start items-start w-full h-20 pl-4 pt-4">
                        <img src="/logo-salman.svg" className="w-17 h-17" />
                    </div>
                    <div>
                        <h1 className="text-3xl text-black mt-15">Login</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center justify-center w-[70%] mt-10">
                        <div className="w-[100%] h-12 border-3 border-d-brown rounded-lg flex items-center pl-2">
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full h-full bg-transparent outline-none ml-2 placeholder-d-brown font-medium"
                            />
                        </div>
                        <div className="w-[100%] h-12 border-3 border-d-brown rounded-lg flex items-center pl-2">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full h-full bg-transparent outline-none ml-2 placeholder-d-brown font-medium"
                            />
                        </div>
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full h-12 bg-l-brown font-medium text-bonewhite mt-4 rounded-lg cursor-pointer hover:bg-l2-brown"
                        >
                            Login
                        </button>

                        <button
                            onClick={() => {
                                window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, '_self');
                            }}
                            className="w-full h-12 bg-white text-black border border-d-brown mt-4 rounded-lg hover:bg-gray-100"
                        >
                            Login menggunakan akun Google
                        </button>

                    </form>
                    <p className="text-black mt-4">Belum punya akun? <a href="/signup" className="text-d-brown">Daftar</a></p>
                </div>
            </div>
        </main>
    );
}
