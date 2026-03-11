"use client";

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryPage() {
  const images = [
    "/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png",
    "/images/progress image.jpg",
    "/images/analysis-img-1.png",
    "/images/analysis-img-2.png",
    "/images/we are staraptor bg.png",
    "/images/logo.png"
  ];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="bg-background min-h-screen py-24 text-gray-sub">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p className="text-label mb-2">Media</p>
          <h1 className="text-title-main">Gallery</h1>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              className="relative aspect-video bg-[#1f1f1f] rounded-lg overflow-hidden cursor-pointer group border border-gray-sub/10 hover:border-primary/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.07, ease: 'easeOut' }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage(src)}
            >
              <Image
                src={src}
                alt={`Gallery image ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-widest text-sm drop-shadow-md">View</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-primary transition-colors focus:outline-none"
              onClick={() => setSelectedImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.div
              className="relative w-full h-full max-w-5xl max-h-[80vh]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={selectedImage} alt="Expanded view" fill className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
