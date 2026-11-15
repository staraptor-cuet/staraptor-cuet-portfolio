"use client";

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '@/lib/useContent';

export default function GalleryPage() {
  const { content } = useSiteContent();
  const galleryItems = content?.gallery || [
    { id: '1', src: "/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png", title: "Staraptor VTOL" },
    { id: '2', src: "/images/progress image.jpg", title: "Progress" },
    { id: '3', src: "/images/analysis-img-1.png", title: "CFD Analysis" },
    { id: '4', src: "/images/analysis-img-2.png", title: "CFD Analysis" },
    { id: '5', src: "/images/we are staraptor bg.png", title: "Staraptor Logo" },
    { id: '6', src: "/images/logo.png", title: "Emblem" }
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
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              className="relative aspect-video bg-[#1f1f1f] rounded-lg overflow-hidden cursor-pointer group border border-gray-sub/10 hover:border-primary/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.07, ease: 'easeOut' }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage(item.src)}
            >
              <Image
                src={item.src}
                alt={item.title || `Gallery image ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized={item.src.startsWith('data:') || item.src.startsWith('http')}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex flex-col items-center justify-center p-4">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-widest text-xs bg-[#D04741]/80 px-3 py-1 rounded drop-shadow-md mb-1">
                  View
                </span>
                {item.title && (
                  <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity text-center truncate max-w-full">
                    {item.title}
                  </span>
                )}
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
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Selected view"
                fill
                className="object-contain"
                unoptimized={selectedImage.startsWith('data:') || selectedImage.startsWith('http')}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
