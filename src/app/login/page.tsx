import Link from 'next/link';

export default function Login() {
  return (
    <main className="relative w-screen h-screen bg-cream flex items-center justify-center overflow-hidden">
        <img 
            src="/elipse.svg" 
            alt="" 
            className="absolute top-100 w-[200vw] z-0"/>
        <div className="w-[60vw] h-[80vh] bg-cream shadow-2xl shadow-black/30 z-10"></div>
    </main>
  );
}