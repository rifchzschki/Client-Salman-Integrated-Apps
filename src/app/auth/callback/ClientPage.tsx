'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CallbackClient() {
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        const token = params.get('token');
        const email = params.get('email');

        if (token && email) {
            localStorage.setItem('token', token);
            router.push('/');
        } else {
            router.push('/login');
        }
    }, [params, router]);

    return (
        <main className="w-screen h-screen flex items-center justify-center">
            <p className="text-lg">Sedang login menggunakan akun Google...</p>
        </main>
    );
}
