'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  Tag,
  Loader2,
  X
} from 'lucide-react';
import { GalleryItem } from '@/lib/types';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    src: '',
    title: '',
    category: 'Render',
    date: '2026',
  });

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.gallery) setGallery(data.gallery);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to remove this photo from the gallery?')) return;
    saveGallery(gallery.filter((g) => g.id !== id));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.src) {
      alert('Please upload an image first');
      return;
    }

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      src: formData.src,
      title: formData.title || 'Staraptor Media',
      category: formData.category || 'Render',
      date: formData.date || '2026',
    };

    saveGallery([newItem, ...gallery]);
    setModalOpen(false);
    setFormData({ src: '', title: '', category: 'Render', date: '2026' });
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#D04741] mx-auto mb-2" />
        <p className="text-sm text-gray-400">Loading Gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-montserrat">Media Gallery</h1>
          <p className="text-xs text-gray-400 mt-1">
            Upload CAD models, aerodynamic CFD simulations, competition testing, and team photos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <Check size={14} /> Saved Live!
            </span>
          )}
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#D04741] hover:bg-[#b03934] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-[#D04741]/20"
          >
            <Plus size={16} />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-[#1c1c1c] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between group"
          >
            <div className="relative aspect-video w-full bg-black/40 overflow-hidden">
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized={item.src.startsWith('data:') || item.src.startsWith('http')}
              />
              <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                {item.category}
              </span>
            </div>

            <div className="p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                <p className="text-[10px] text-gray-400">{item.date}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                title="Delete Photo"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        {gallery.length === 0 && (
          <div className="col-span-full py-16 text-center bg-[#1c1c1c] rounded-xl border border-white/10">
            <ImageIcon size={32} className="mx-auto text-gray-500 mb-2" />
            <p className="text-sm font-semibold text-gray-400">No photos in the gallery</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h2 className="text-base font-bold text-white font-montserrat">Upload to Gallery</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <ImageUploader
                label="Choose Photo"
                value={formData.src || ''}
                onChange={(url) => setFormData({ ...formData, src: url })}
                recommendedSize="16:9 or high-res photo"
              />

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Photo Title / Caption
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. VTOL Transition Aerodynamics"
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Category Tag
                  </label>
                  <select
                    value={formData.category || 'Render'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                  >
                    <option value="Render">Render</option>
                    <option value="Progress">Progress</option>
                    <option value="Analysis">Analysis</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Branding">Branding</option>
                    <option value="Events">Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Year / Date
                  </label>
                  <input
                    type="text"
                    value={formData.date || '2026'}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.src}
                  className="px-5 py-2 rounded-lg bg-[#D04741] text-white text-xs font-bold transition-all shadow-lg shadow-[#D04741]/20 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <span>Add to Gallery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

