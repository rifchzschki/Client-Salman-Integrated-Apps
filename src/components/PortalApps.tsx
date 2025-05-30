"use client";

const apps = [
  {
    name: "Masjid Salman ITB",
    color: "bg-[#854411] text-white", // Deep brown (matches header)
    link: "https://salmanitb.com/",
  },
  {
    name: "Jurnal Salman",
    color: "bg-[#854411] text-white", // Lighter brown
    link: "https://jurnal.salmanitb.com/JSI",
  },
  {
    name: "BMKA",
    color: "bg-[#854411] text-white", // Soft terracotta
    link: "https://kaderisasi.salmanitb.com/",
  },
  {
    name: "Salman Reading Corner",
    color: "bg-[#854411] text-white", // Darker brown
    link: "https://www.salmanreadingcorner.web.id/",
  },
  {
    name: "OHU",
    color: "bg-[#854411] text-white", // Warm brown
    link: "https://ohu.salmanitb.com/#/",
  },
  {
    name: "Rumah Amal",
    color: "bg-[#854411] text-white", // Muted brownish-purple
    link: "https://rumahamal.org/",
  },
  {
    name: "Wakaf",
    color: "bg-[#854411] text-white", // Soft rusty brown
    link: "https://www.wakafsalman.or.id/",
  },
];

const AppPortal = () => {
  const openLink = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {apps.map((app, index) =>
        app ? (
          <div
            key={index}
            onClick={() => openLink(app.link)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg hover:scale-105 transition-transform cursor-pointer ${app.color}`}
          >
            <span className="mt-2 text-sm font-medium text-center">{app.name}</span>
          </div>
        ) : null
      )}
    </div>
  );
};


export default AppPortal;
