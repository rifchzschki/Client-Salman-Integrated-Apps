import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#663300] text-white py-6 px-4 border-t-4 border-blue-500">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-start gap-6">
        {/* logo */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-10">
          <div className="w-30 h-30 relative">
            <Image src="/logo-salman-text.png" alt="Salman ITB Logo" fill className="object-contain" />
          </div>
          <div className="mt-6 text-sm space-y-2">
            <p className="text-xl font-bold">Hubungi Kami</p>
            <p>Jl Ganesha No. 7 Bandung</p>
            <div>
                <p>Telp: 022-2530708</p>
                <p>WA: 081312924064</p>
            </div>
          </div>
        </div>

        {/* QRIS Donasi */}
        <div className="flex flex-col items-start">
          <p className="mt-6 font-bold mb-2">Qris Donasi:</p>
          <div className="w-32 h-32 bg-gray-300" /> {/* nanti ganti ini dengan QRnya */}
        </div>
      </div>

      {/* sosmed */}
      <div className="pl-75 flex flex-row space-x-6">
        <Link href="https://www.facebook.com/masjidsalmanitb" target="_blank">
          <FaFacebookF className="w-6 h-6 hover:text-blue-400 transition" />
        </Link>
        <Link href="https://twitter.com/salmanitb" target="_blank">
          <FaTwitter className="w-6 h-6 hover:text-blue-300 transition" />
        </Link>
        <Link href="https://www.instagram.com/salmanitb/" target="_blank">
          <FaInstagram className="w-6 h-6 hover:text-pink-400 transition" />
        </Link>
        <Link href="https://www.youtube.com/c/SalmanTV" target="_blank">
          <FaYoutube className="w-6 h-6 hover:text-red-500 transition" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;