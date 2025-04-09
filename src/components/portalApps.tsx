"use client";

import { link } from "fs";
import {
  FaGithub,
  FaYoutube,
  FaTwitter,
  FaFacebook,
  FaGoogle,
  FaSlack,
  FaTrello,
  FaSpotify,
} from "react-icons/fa";

const apps = [
  {
    name: "Masjid Salman ITB",
    icon: <FaGithub size={32} />,
    color: "bg-gray-800 text-white",
    link: "https://salmanitb.com/",
  },
  {
    name: "Jurnal Salman",
    icon: <FaYoutube size={32} />,
    color: "bg-red-600 text-white",
    link: "https://jurnal.salmanitb.com/JSI",
  },
  {
    name: "BMKA",
    icon: <FaTwitter size={32} />,
    color: "bg-blue-500 text-white",
    link: "https://kaderisasi.salmanitb.com/",
  },
  {
    name: "Salman Reading Corner",
    icon: <FaFacebook size={32} />,
    color: "bg-blue-700 text-white",
    link: "https://www.salmanreadingcorner.web.id/",
  },
  {
    name: "OHU",
    icon: <FaFacebook size={32} />,
    color: "bg-blue-700 text-white",
    link: "https://ohu.salmanitb.com/#/",
  },
  {
    name: "Rumah Amal",
    icon: <FaFacebook size={32} />,
    color: "bg-blue-700 text-white",
    link: "https://rumahamal.org/",
  },
  ,
  {
    name: "Wakaf",
    icon: <FaFacebook size={32} />,
    color: "bg-blue-700 text-white",
    link: "https://www.wakafsalman.or.id/",
  },
];

const AppPortal = () => {
  const openLink = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {apps.map((app, index) => (
        <div
          onClick={() => openLink(app.link)}
          key={index}
          className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer ${app.color}`}
        >
          <span className="mt-2 text-sm font-medium text-center">{app.name}</span>
        </div>
      ))}
    </div>
  );
};

export default AppPortal;
