"use client";

import React from "react";
import { motion } from "framer-motion";

const images = [
  {
    src: "masjid-salman-itb.jpg",
    caption: "Keindahan Alam",
  },
  {
    src: "masjid-salman-itb.jpg",
    caption: "Pemandangan Kota Malam",
  },
  {
    src: "masjid-salman-itb.jpg",
    caption: "Gunung yang Megah",
  },
  {
    src: "masjid-salman-itb.jpg",
    caption: "Hutan Tropis",
  },
  {
    src: "masjid-salman-itb.jpg",
    caption: "Pantai Biru",
  },
];

const ImageCardList = () => {
  return (
    <div className="overflow-auto flex gap-4 py-8 scrollbar-thin scrollbar-thumb-gray-300 w-full">
      {images.map((item, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="min-w-[280px] max-w-[300px] min-h-[300px] max-h-[320px]: bg-white shadow-xl rounded-xl overflow-scroll hover:shadow-2xl transition-shadow duration-300"
        >
          <img
            src={item.src}
            alt={item.caption}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {item.caption}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum.
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ImageCardList;
