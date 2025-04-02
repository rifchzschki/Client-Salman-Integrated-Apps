"use client";

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
    name: "GitHub",
    icon: <FaGithub size={32} />,
    color: "bg-gray-800 text-white",
  },
  {
    name: "YouTube",
    icon: <FaYoutube size={32} />,
    color: "bg-red-600 text-white",
  },
  {
    name: "Twitter",
    icon: <FaTwitter size={32} />,
    color: "bg-blue-500 text-white",
  },
  {
    name: "Facebook",
    icon: <FaFacebook size={32} />,
    color: "bg-blue-700 text-white",
  }
];

const AppPortal = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {apps.map((app, index) => (
        <div
          key={index}
          className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer ${app.color}`}
        >
          {app.icon}
          <span className="mt-2 text-sm font-medium">{app.name}</span>
        </div>
      ))}
    </div>
  );
};

export default AppPortal;
