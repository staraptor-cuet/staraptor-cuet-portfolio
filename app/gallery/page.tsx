'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  Layers,
  Tag,
  Download,
  Eye,
  Camera,
  FolderOpen,
  ArrowRight
} from 'lucide-react';
import { useSiteContent } from '@/lib/useContent';
import { GalleryItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay },
  }),
};

export default function GalleryPage() {
  const { content, loading } = useSiteContent();

  const allGalleryItems: GalleryItem[] = useMemo(() => {
    const raw = content?.gallery || [];
    // Only show published photos on public gallery
    return raw.filter((item) => item.published !== false);
  }, [content]);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination / Load more
  const ITEMS_PER_PAGE = 9;
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  // Lightbox state
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Extract dynamic categories, projects, and years from data
  const categories = useMemo(() => {
    const set = new Set<string>();
    allGalleryItems.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [allGalleryItems]);

  const projects = useMemo(() => {
    const set = new Set<string>();
    allGalleryItems.forEach((item) => {
      if (item.project) set.add(item.project);
    });
    return ['All', ...Array.from(set)];
  }, [allGalleryItems]);

  const years = useMemo(() => {
    const set = new Set<string>();
    allGalleryItems.forEach((item) => {
      const year = item.year || (item.date ? item.date.slice(0, 4) : '');
      if (year) set.add(year);
    });
    return ['All', ...Array.from(set).sort().reverse()];
  }, [allGalleryItems]);

  // Filtered gallery items
  const filteredItems = useMemo(() => {
    return allGalleryItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesProject =
        selectedProject === 'All' || item.project?.toLowerCase() === selectedProject.toLowerCase();
      const itemYear = item.year || (item.date ? item.date.slice(0, 4) : '');
      const matchesYear = selectedYear === 'All' || itemYear === selectedYear;

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.caption?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.project?.toLowerCase().includes(q);

      return matchesCategory && matchesProject && matchesYear && matchesQuery;
    });
  }, [allGalleryItems, selectedCategory, selectedProject, selectedYear, searchQuery]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategory, selectedProject, selectedYear, searchQuery]);

  // Lightbox navigation
  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev! + 1) % filteredItems.length);
  }, [activePhotoIndex, filteredItems.length]);

  const prevPhoto = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  }, [activePhotoIndex, filteredItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activePhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, nextPhoto, prevPhoto]);

  const currentPhoto = activePhotoIndex !== null ? filteredItems[activePhotoIndex] : null;

  return (
    <div className="bg-[#202020] min-h-screen py-12 md:py-20 text-gray-sub flex flex-col items-center justify-start">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <Badge variant="glow" className="uppercase tracking-widest text-[11px] font-mono px-3 py-1 mb-3">
            Media & Field Archives
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-bold text-[#d84e46]">
            Media Gallery
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            High-fidelity renders, fabrication logs, wind-tunnel simulations, and field trials documenting Team Staraptor CUET&apos;s journey.
          </p>
        </motion.div>

        {/* Filter Controls Bar */}
        <div className="bg-[#181818] border border-white/10 rounded-2xl p-5 mb-10 shadow-xl space-y-4">
          
          {/* Top Row: Search + Quick Category Pills */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search photo titles, captions, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Project Filter Dropdown & Year Filter Dropdown */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Project Dropdown */}
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300">
                <Layers size={13} className="text-[#EF5F5A]" />
                <span className="text-[11px] font-mono text-gray-400">Project:</span>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p} value={p} className="bg-[#1c1c1c] text-white">
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Dropdown */}
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300">
                <Calendar size={13} className="text-[#EF5F5A]" />
                <span className="text-[11px] font-mono text-gray-400">Year:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y} className="bg-[#1c1c1c] text-white">
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button (when active) */}
              {(selectedCategory !== 'All' || selectedProject !== 'All' || selectedYear !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedProject('All');
                    setSelectedYear('All');
                    setSearchQuery('');
                  }}
                  className="text-xs text-[#EF5F5A] hover:underline flex items-center gap-1 font-mono px-2 py-1"
                >
                  <X size={12} /> Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-[11px] font-mono uppercase text-gray-500 mr-1 shrink-0">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#D04741] text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 px-1 text-xs text-gray-400 font-mono">
          <span>
            Showing <strong className="text-white">{Math.min(visibleCount, filteredItems.length)}</strong> of{' '}
            <strong className="text-white">{filteredItems.length}</strong> photographs
          </span>
          {allGalleryItems.length > filteredItems.length && (
            <span className="text-amber-400/90 text-[11px]">Filtered Collection</span>
          )}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#D04741] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-sm text-gray-400 font-mono">Loading high-resolution media...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-16 text-center rounded-3xl border border-dashed border-white/10 bg-[#181818] my-10 max-w-xl mx-auto">
            <Camera size={44} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 font-montserrat">No photos found</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              No gallery items match the current search or filter criteria. Try resetting your filters to explore all aerospace media.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedProject('All');
                setSelectedYear('All');
                setSearchQuery('');
              }}
              size="sm"
              className="rounded-xl font-bold px-6"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredItems.slice(0, visibleCount).map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 6) * 0.06 }}
                onClick={() => openLightbox(idx)}
                className="group cursor-pointer relative bg-[#181818] rounded-2xl overflow-hidden border border-white/10 hover:border-[#D04741]/60 shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Photo Image Aspect */}
                <div className="relative aspect-[16/10] bg-black/50 overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={item.src.startsWith('data:') || item.src.startsWith('http')}
                  />

                  {/* Dual Top & Bottom Scrim Gradients for guaranteed contrast on ANY background */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-[1]" />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-[1]" />

                  {/* Top Badges (High Contrast Solid Pills) */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {item.category || 'Media'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.isCover && (
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#D04741] border border-[#ff6660] text-white shadow-[0_2px_8px_rgba(0,0,0,0.8)] flex items-center gap-1">
                          <span>★</span>
                          <span>Cover</span>
                        </span>
                      )}
                      {item.project && !item.isCover && (
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/90 backdrop-blur-md border border-[#EF5F5A] text-white shadow-[0_2px_8px_rgba(0,0,0,0.8)] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EF5F5A]" />
                          <span>{item.project}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hover Quick Zoom Pill */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <div className="p-3 rounded-full bg-black/80 backdrop-blur-md border border-white/30 text-white shadow-2xl group-hover:scale-110 transition-transform">
                      <Maximize2 size={18} />
                    </div>
                  </div>

                  {/* Date Stamp on Card (High-Contrast Solid Dark Pill with Border) */}
                  <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <Calendar size={11} className="text-[#EF5F5A]" />
                    <span className="text-gray-100">{item.date}</span>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-4 bg-[#181818] space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold font-montserrat text-white group-hover:text-[#ff7872] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  {item.project && item.isCover && (
                    <div className="pt-2 text-[11px] font-mono text-gray-500">
                      Project: <span className="text-gray-300 font-semibold">{item.project}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button (Pagination) */}
        {visibleCount < filteredItems.length && (
          <div className="mt-14 text-center">
            <Button
              onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
              size="lg"
              className="rounded-xl font-bold px-8 py-3 bg-[#181818] hover:bg-[#D04741] text-white border border-white/10 hover:border-[#D04741] transition-all shadow-xl group"
            >
              <span>Load More Photographs</span>
              <span className="text-xs font-mono ml-2 text-gray-400 group-hover:text-white">
                ({filteredItems.length - visibleCount} remaining)
              </span>
            </Button>
          </div>
        )}

      </div>

      {/* Advanced Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && currentPhoto && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Lightbox Topbar */}
            <div className="w-full max-w-7xl flex items-center justify-between pb-3 border-b border-white/10 text-white">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-400">
                  [{activePhotoIndex + 1} / {filteredItems.length}]
                </span>
                {currentPhoto.category && (
                  <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300">
                    {currentPhoto.category}
                  </span>
                )}
                {currentPhoto.project && (
                  <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#D04741]/30 text-[#ff8d87]">
                    {currentPhoto.project}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={currentPhoto.src}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  title="Open full resolution in new tab"
                >
                  <Download size={18} />
                </a>
                <button
                  onClick={closeLightbox}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors"
                  title="Close (Esc)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Lightbox Main Stage (With Left / Right Controls) */}
            <div className="relative w-full max-w-6xl flex-1 flex items-center justify-center my-4 overflow-hidden">
              
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-[#D04741] text-white backdrop-blur-md border border-white/10 transition-colors shadow-2xl focus:outline-none"
                aria-label="Previous photograph"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Photo Display */}
              <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center select-none">
                <Image
                  src={currentPhoto.src}
                  alt={currentPhoto.title}
                  fill
                  className="object-contain"
                  priority
                  unoptimized={currentPhoto.src.startsWith('data:') || currentPhoto.src.startsWith('http')}
                />
              </div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-[#D04741] text-white backdrop-blur-md border border-white/10 transition-colors shadow-2xl focus:outline-none"
                aria-label="Next photograph"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Lightbox Caption & Details Footer */}
            <div className="w-full max-w-4xl text-center bg-[#181818]/90 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-2xl">
              <h2 className="text-lg sm:text-xl font-bold font-montserrat text-white">
                {currentPhoto.title}
              </h2>
              {currentPhoto.caption && (
                <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl mx-auto leading-relaxed">
                  {currentPhoto.caption}
                </p>
              )}
              <div className="flex items-center justify-center gap-4 text-xs font-mono text-gray-400 mt-2">
                <span>Date: <strong className="text-white">{currentPhoto.date}</strong></span>
                {currentPhoto.project && (
                  <>
                    <span>•</span>
                    <span>Platform: <strong className="text-white">{currentPhoto.project}</strong></span>
                  </>
                )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
