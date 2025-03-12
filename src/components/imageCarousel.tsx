"use client";

import React from "react";
import { motion } from "framer-motion";
import Sliders from "react-slick";

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
    caption: "Hutan yang Hijau",
  },
];

const ImageCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    adaptiveHeight: true,
  };

  return (
    <div className="mx-auto my-auto max-w-4xl w-1/2">
      <Sliders {...settings}>
        {images.map((item, index) => (
          <div key={index} className="relative w-1/2">
            <img
              src={item.src}
              alt={item.caption}
              className="w-full rounded-lg shadow-lg"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-4 left-0 w-full text-center bg-black/50 text-white py-3 rounded-b-lg"
            >
              <p className="text-lg font-semibold">{item.caption}</p>
            </motion.div>
          </div>
        ))}
      </Sliders>
    </div>
  );
};

export default ImageCarousel;
