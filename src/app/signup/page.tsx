"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
type FormFields = 'first_name' | 'last_name' | 'email' | 'password' | 'confirm_password';
type FormState = Record<FormFields, string>;

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  // untuk tampilan bahasa indonesia
  const fieldPlaceholders: Record<string, string> = {
    first_name: "Nama Depan",
    last_name: "Nama Belakang",
    email: "Email",
    password: "Kata Sandi",
    confirm_password: "Konfirmasi Kata Sandi",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) router.replace("/");
      })
      .catch(() => {});
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNonAlphanumeric = /[^a-zA-Z0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasNonAlphanumeric && isLongEnough;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});

    const newErrors: Partial<typeof form> = {};

    if (!form.first_name.trim())
      newErrors.first_name = "Nama depan harus diisi";
    if (!form.last_name.trim())
      newErrors.last_name = "Nama belakang harus diisi";
    if (!form.email.trim()) newErrors.email = "Email harus diisi";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email tidak valid";
    if (!form.password) newErrors.password = "Kata sandi harus diisi";
    else if (!validatePassword(form.password))
      newErrors.password =
        "Kata sandi harus minimal 8 karakter, mengandung satu huruf kapital dan satu karakter spesial";
    if (!form.confirm_password)
      newErrors.confirm_password = "Harap konfirmasi kata sandi anda";
    else if (form.password !== form.confirm_password)
      newErrors.confirm_password = "Kata sandi tidak cocok";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.data.access_token);
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <main className="w-screen h-screen bg-cream flex items-center justify-center overflow-hidden">
      <div className="relative w-[75vw] h-[80vh] bg-bonewhite rounded-4xl flex items-center justify-end overflow-hidden">
        <Image
          src="/masjid-salman-itb.jpg"
          alt="Masjid Salman Itb"
          fill
          className="absolute min-w-[100%] min-h-[100%] object-cover z-0"
        />
        <div className="absolute w-[35%] h-[95%] flex flex-col gap-4 items-center justify-start bg-bonewhite z-10 m-4 rounded-3xl overflow-auto px-4 pt-6">
          <div className="flex justify-start items-start w-full pl-4">
            <Image src="/logo-salman.svg" alt="logo salman itb" width={17} height={17} className="w-17 h-17" />
          </div>
          <h1 className="text-3xl text-black">Daftar</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 items-center justify-center w-full"
          >
            {[
              "first_name",
              "last_name",
              "email",
              "password",
              "confirm_password",
            ].map((field) => (
              <div key={field} className="w-[80%] flex flex-col gap-1">
                <input
                  type={
                    field.toLowerCase().includes("password")
                      ? "password"
                      : "text"
                  }
                  name={field}
                  placeholder={fieldPlaceholders[field]}
                  value={form[field as FormFields]}
                  onChange={handleChange}
                  className={`w-full h-12 px-3 border-2 ${
                    errors[field as keyof typeof form]
                      ? "border-red-500"
                      : "border-d-brown"
                  } rounded-lg placeholder-d-brown font-medium bg-transparent outline-none`}
                />
                {errors[field as keyof typeof form] && (
                  <p className="text-red-500 text-sm">
                    {errors[field as keyof typeof form]}
                  </p>
                )}
              </div>
            ))}
            {error && <p className="text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-[80%] h-12 bg-l-brown font-medium text-bonewhite rounded-lg mt-2 hover:bg-l2-brown"
            >
              Daftar
            </button>
          </form>
          <p className="text-black">
            Sudah punya akun?{" "}
            <a href="/login" className="text-d-brown">
              Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
