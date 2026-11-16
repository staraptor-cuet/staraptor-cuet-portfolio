'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Check,
  Tag,
  Loader2,
  X,
  Star,
  Eye,
  EyeOff,
  Home,
  ArrowUp,
  ArrowDown,
  UploadCloud,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Calendar
} from 'lucide-react';
import { GalleryItem } from '@/lib/types';
import ImageUploader from '@/components/admin/ImageUploader';
import { setPreviewDraft } from '@/lib/preview';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    src: '',
    title: '',
    caption: '',
    category: 'Render',
    project: 'Staraptor V1',
    year: '2026',
    date: new Date().toISOString().split('T')[0],
    isCover: false,
    featuredOnHome: true,
    published: true,
  });

  // Multiple files upload state
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [batchCategory, setBatchCategory] = useState('Render');
  const [batchProject, setBatchProject] = useState('Staraptor V1');
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.gallery) setGallery(data.gallery);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Broadcast real-time preview draft whenever gallery photos or status change
  useEffect(() => {
    if (!loading) {
      setPreviewDraft('gallery', gallery);
    }
  }, [gallery, loading]);

  const saveGallery = async (updated: GalleryItem[]) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'gallery', data: updated }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save');
      setGallery(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving gallery');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      src: '',
      title: '',
      caption: '',
      category: 'Render',
      project: 'Staraptor V1',
      year: '2026',
      date: new Date().toISOString().split('T')[0],
      isCover: false,
      featuredOnHome: true,
      published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.src) {
      alert('Please upload or provide an image URL');
      return;
    }

    let updated: GalleryItem[];

    if (editingItem) {
      updated = gallery.map((item) => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            ...formData,
            title: formData.title || 'Staraptor Media',
          } as GalleryItem;
        }
        // If this photo was set as cover, un-set other covers
        if (formData.isCover && item.id !== editingItem.id) {
          return { ...item, isCover: false };
        }
        return item;
      });
    } else {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        src: formData.src,
        title: formData.title || 'Staraptor Media',
        caption: formData.caption || '',
        category: formData.category || 'Render',
        project: formData.project || 'Staraptor V1',
        year: formData.year || '2026',
        date: formData.date || new Date().toISOString().split('T')[0],
        isCover: Boolean(formData.isCover),
        featuredOnHome: formData.featuredOnHome !== false,
        published: formData.published !== false,
        createdAt: new Date().toISOString(),
      };

      if (newItem.isCover) {
        updated = [newItem, ...gallery.map((g) => ({ ...g, isCover: false }))];
      } else {
        updated = [newItem, ...gallery];
      }
    }

    await saveGallery(updated);
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this photo from the gallery?')) return;
    const updated = gallery.filter((g) => g.id !== id);
    await saveGallery(updated);
  };

  const toggleCover = async (id: string) => {
    const updated = gallery.map((item) => ({
      ...item,
      isCover: item.id === id ? !item.isCover : false, // only one cover image
    }));
    await saveGallery(updated);
  };

  const toggleFeaturedOnHome = async (id: string) => {
    const updated = gallery.map((item) => {
      if (item.id === id) {
        return { ...item, featuredOnHome: item.featuredOnHome === false ? true : false };
      }
      return item;
    });
    await saveGallery(updated);
  };

  const togglePublished = async (id: string) => {
    const updated = gallery.map((item) => {
      if (item.id === id) {
        return { ...item, published: item.published === false ? true : false };
      }
      return item;
    });
    await saveGallery(updated);
  };

  const moveItem = async (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= gallery.length) return;
    const updated = [...gallery];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    await saveGallery(updated);
  };

  // Multiple image upload handler
  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setBatchUploading(true);
    setBatchProgress({ current: 0, total: files.length });

    const newItems: GalleryItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      setBatchProgress({ current: i + 1, total: files.length });

      try {
        const dataForm = new FormData();
        dataForm.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: dataForm,
        });

        const uploadData = await res.json();
        if (res.ok && uploadData.success && uploadData.url) {
          // Format filename into a clean title
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const formattedTitle = nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1);

          newItems.push({
            id: `gal-${Date.now()}-${i}`,
            src: uploadData.url,
            title: formattedTitle,
            caption: '',
            category: batchCategory,
            project: batchProject,
            year: '2026',
            date: new Date().toISOString().split('T')[0],
            isCover: false,
            featuredOnHome: false,
            published: true,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Batch upload error for file', file.name, err);
      }
    }

    setBatchUploading(false);
    setBatchModalOpen(false);

    if (newItems.length > 0) {
      const updated = [...newItems, ...gallery];
      await saveGallery(updated);
    }
  };

  // Filter list for display
  const filteredList = gallery.filter((item) => {
    const matchesCategory =
      categoryFilter === 'All' || item.category?.toLowerCase() === categoryFilter.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.title?.toLowerCase().includes(q) ||
      item.caption?.toLowerCase().includes(q) ||
      item.project?.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const uniqueCategories = ['All', ...Array.from(new Set(gallery.map((g) => g.category || 'Render')))];

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#D04741] mx-auto mb-2" />
        <p className="text-sm text-gray-400">Loading Gallery Console...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-[#D04741]/10 text-[#EF5F5A]">
              <ImageIcon size={20} />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-montserrat">
              Gallery Management
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            Upload multiple photos, organize categories, assign aerospace projects, set homepage features, and control publishing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <Check size={14} /> Synced & Saved
            </span>
          )}

          {/* Multiple Upload Button */}
          <button
            onClick={() => setBatchModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-semibold transition-colors"
          >
            <UploadCloud size={16} />
            <span>Multiple Upload</span>
          </button>

          {/* Single Add Photo Button */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D04741] to-[#EF5F5A] text-white text-sm font-bold shadow-lg shadow-[#D04741]/20 hover:opacity-95 transition-opacity"
          >
            <Plus size={16} />
            <span>Add Photo</span>
          </button>
        </div>
      </div>

      {/* Info Notice & Public Link */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#1c1c1c] text-xs text-gray-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>💡 <strong>Tip:</strong> Toggle <strong>Cover</strong> (★) to set the primary render, <strong>Home</strong> (<Home size={11} className="inline text-[#EF5F5A]" />) to feature on the homepage, and <strong>Publish</strong> (<Eye size={11} className="inline text-emerald-400" />) to show or hide.</span>
        </div>
        <a
          href="/gallery"
          target="_blank"
          rel="noreferrer"
          className="text-[#EF5F5A] hover:underline flex items-center gap-1 font-semibold shrink-0"
        >
          <span>View Public Gallery</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search photos by title, project, caption..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-mono text-gray-400 uppercase">Category:</span>
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#D04741] text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Photos Grid Table */}
      {filteredList.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-dashed border-white/10 bg-[#181818]">
          <ImageIcon size={40} className="text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No photos found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
            Upload single photos or drag-and-drop multiple images to populate the team gallery.
          </p>
          <div className="inline-flex gap-3">
            <button
              onClick={() => setBatchModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
            >
              Upload Multiple
            </button>
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-[#D04741] hover:bg-[#b03934] text-white text-xs font-bold transition-colors"
            >
              Add First Photo
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((item, idx) => {
            const actualIndex = gallery.findIndex((g) => g.id === item.id);
            const isPublished = item.published !== false;
            const isFeatured = item.featuredOnHome !== false;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all ${
                  item.isCover
                    ? 'border-[#D04741] bg-gradient-to-b from-[#241a1a] to-[#1a1a1a] shadow-lg shadow-[#D04741]/10'
                    : isPublished
                    ? 'border-white/10 bg-[#1a1a1a] hover:border-white/20'
                    : 'border-white/5 bg-[#141414] opacity-60'
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[16/10] bg-black/50 overflow-hidden group">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 350px"
                    unoptimized={item.src.startsWith('data:') || item.src.startsWith('http')}
                  />

                  {/* Dual Top & Bottom Scrim Gradients for guaranteed contrast on ANY background */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-[1]" />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-[1]" />

                  {/* Badges on Image (High Contrast Solid Pills) */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {item.category || 'Render'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.isCover && (
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#D04741] border border-[#ff6660] text-white shadow-[0_2px_8px_rgba(0,0,0,0.8)] flex items-center gap-1">
                          <span>★</span>
                          <span>Cover</span>
                        </span>
                      )}
                      {!isPublished && (
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-red-600/90 border border-red-400 text-white shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Tags: Project & Date (High-Contrast Solid Dark Pills) */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    {item.project ? (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-[#EF5F5A] text-white shadow-[0_2px_8px_rgba(0,0,0,0.8)] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EF5F5A]" />
                        <span>{item.project}</span>
                      </span>
                    ) : (
                      <span />
                    )}

                    <div className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      <Calendar size={11} className="text-[#EF5F5A]" />
                      <span className="text-gray-100">{item.date}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white font-montserrat truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.caption || 'No caption provided.'}
                    </p>
                  </div>

                  {/* Controls / Toggles Bar */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    
                    {/* Status Toggles (Cover, Home, Publish) */}
                    <div className="flex items-center gap-1">
                      {/* Set Cover Image */}
                      <button
                        onClick={() => toggleCover(item.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          item.isCover
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-white/5 text-gray-400 hover:text-amber-300 border-transparent hover:border-white/10'
                        }`}
                        title={item.isCover ? 'Current Cover Image' : 'Set as Primary Cover'}
                      >
                        <Star size={13} className={item.isCover ? 'fill-amber-400' : ''} />
                      </button>

                      {/* Feature on Homepage */}
                      <button
                        onClick={() => toggleFeaturedOnHome(item.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isFeatured
                            ? 'bg-[#D04741]/20 text-[#ff837d] border-[#D04741]/40'
                            : 'bg-white/5 text-gray-400 hover:text-[#ff837d] border-transparent hover:border-white/10'
                        }`}
                        title={isFeatured ? 'Featured on Homepage' : 'Not on Homepage'}
                      >
                        <Home size={13} />
                      </button>

                      {/* Publish / Unpublish */}
                      <button
                        onClick={() => togglePublished(item.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isPublished
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-red-500/20 text-red-400 border-red-500/40'
                        }`}
                        title={isPublished ? 'Published (Visible)' : 'Unpublished (Hidden)'}
                      >
                        {isPublished ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                    </div>

                    {/* Reorder and Edit Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItem(actualIndex, 'up')}
                        disabled={actualIndex === 0}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        onClick={() => moveItem(actualIndex, 'down')}
                        disabled={actualIndex === gallery.length - 1}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete Photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Photo Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1f1f1f]">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#D04741]/20 text-[#EF5F5A]">
                  <ImageIcon size={18} />
                </span>
                <h2 className="text-base font-bold text-white font-montserrat">
                  {editingItem ? 'Edit Photo Details' : 'Add New Photograph'}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleModalSubmit} className="p-6 space-y-4 overflow-y-auto">
              
              {/* Image Upload Component */}
              <div>
                <ImageUploader
                  value={formData.src || ''}
                  onChange={(url: string) => setFormData({ ...formData, src: url })}
                  label="Photograph File"
                  recommendedSize="Recommended 16:9 or 4:3 high-res photo"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Staraptor VTOL 3D Model"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741]"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Detailed Caption / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the context, technical details, fabrication phase, or flight trial conditions..."
                  value={formData.caption || ''}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741] leading-relaxed resize-y"
                />
              </div>

              {/* Grid: Category, Project, Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category || 'Render'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741]"
                  >
                    <option value="Render">Render</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Flight Testing">Flight Testing</option>
                    <option value="CFD Analysis">CFD Analysis</option>
                    <option value="Team & Events">Team & Events</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>

                {/* Project */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Assigned Project
                  </label>
                  <input
                    type="text"
                    placeholder="Staraptor V1, METU 2026"
                    value={formData.project || ''}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741]"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Date / Year
                  </label>
                  <input
                    type="text"
                    placeholder="2026 or 2026-03-01"
                    value={formData.date || ''}
                    onChange={(e) => {
                      const d = e.target.value;
                      setFormData({
                        ...formData,
                        date: d,
                        year: d.slice(0, 4) || '2026',
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741]"
                  />
                </div>
              </div>

              {/* Options Toggles */}
              <div className="pt-2 space-y-2.5 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="cover-check"
                    checked={Boolean(formData.isCover)}
                    onChange={(e) => setFormData({ ...formData, isCover: e.target.checked })}
                    className="w-4 h-4 rounded text-[#D04741] focus:ring-[#D04741] bg-black/40 border-white/20"
                  />
                  <label htmlFor="cover-check" className="text-xs text-gray-300 cursor-pointer select-none">
                    ★ Set as Primary Cover Image
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={formData.featuredOnHome !== false}
                    onChange={(e) => setFormData({ ...formData, featuredOnHome: e.target.checked })}
                    className="w-4 h-4 rounded text-[#D04741] focus:ring-[#D04741] bg-black/40 border-white/20"
                  />
                  <label htmlFor="featured-check" className="text-xs text-gray-300 cursor-pointer select-none">
                    Feature on Homepage Showcase Grid
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published-check"
                    checked={formData.published !== false}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-[#D04741] focus:ring-[#D04741] bg-black/40 border-white/20"
                  />
                  <label htmlFor="published-check" className="text-xs text-gray-300 cursor-pointer select-none">
                    Publish (Make visible on public website)
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#D04741] to-[#EF5F5A] text-white text-xs font-bold hover:opacity-95 transition-opacity disabled:opacity-50"
                >
                  {saving && <Loader2 size={12} className="animate-spin" />}
                  <span>{editingItem ? 'Update Photo' : 'Save Photo'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Multiple Image Upload Modal */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1f1f1f]">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#D04741]/20 text-[#EF5F5A]">
                  <UploadCloud size={18} />
                </span>
                <h2 className="text-base font-bold text-white font-montserrat">
                  Multiple Image Upload
                </h2>
              </div>
              <button
                onClick={() => setBatchModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                Select multiple photos at once (PNG, JPG, WEBP). They will be processed, uploaded, and added to the gallery automatically.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Assign Category
                  </label>
                  <select
                    value={batchCategory}
                    onChange={(e) => setBatchCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741]"
                  >
                    <option value="Render">Render</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Flight Testing">Flight Testing</option>
                    <option value="CFD Analysis">CFD Analysis</option>
                    <option value="Team & Events">Team & Events</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Assign Project
                  </label>
                  <input
                    type="text"
                    placeholder="Staraptor V1"
                    value={batchProject}
                    onChange={(e) => setBatchProject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741]"
                  />
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={batchFileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleBatchUpload}
                className="hidden"
              />

              {/* Dropzone / Upload Trigger */}
              <div
                onClick={() => batchFileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-white/15 hover:border-[#D04741] rounded-2xl bg-black/30 text-center cursor-pointer transition-colors group"
              >
                {batchUploading ? (
                  <div className="space-y-2">
                    <Loader2 size={32} className="animate-spin text-[#EF5F5A] mx-auto" />
                    <p className="text-xs text-white font-bold">
                      Uploading {batchProgress.current} of {batchProgress.total} photos...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadCloud size={36} className="text-gray-500 group-hover:text-[#EF5F5A] mx-auto transition-colors" />
                    <p className="text-xs font-bold text-white">
                      Click to choose multiple files
                    </p>
                    <p className="text-[11px] text-gray-400">
                      PNG, JPG, WEBP up to 10MB each
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setBatchModalOpen(false)}
                  disabled={batchUploading}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
