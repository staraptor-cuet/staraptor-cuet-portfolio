'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  Check,
  Calendar,
  Loader2,
  X
} from 'lucide-react';
import { ProgressItem } from '@/lib/types';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminProgressPage() {
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProgressItem | null>(null);
  const [formData, setFormData] = useState<Partial<ProgressItem>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    image: '',
  });

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.progress) setProgress(data.progress);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const saveProgress = async (updated: ProgressItem[]) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'progress', data: updated }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save');
      setProgress(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving progress');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `prog-${Date.now()}`,
      title: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      image: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ProgressItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this progress update?')) return;
    saveProgress(progress.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Title is required');
      return;
    }

    let updated: ProgressItem[];
    if (editingItem) {
      updated = progress.map((p) => (p.id === editingItem.id ? ({ ...formData } as ProgressItem) : p));
    } else {
      updated = [{ ...formData, id: `prog-${Date.now()}` } as ProgressItem, ...progress];
    }

    setModalOpen(false);
    saveProgress(updated);
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#D04741] mx-auto mb-2" />
        <p className="text-sm text-gray-400">Loading Progress Milestones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-montserrat">Progress & Milestones</h1>
          <p className="text-xs text-gray-400 mt-1">
            Post updates on drone manufacturing, wind tunnel tests, flight simulations, and competition stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <Check size={14} /> Saved Live!
            </span>
          )}
          <button
            onClick={handleOpenAdd}
            className="bg-[#D04741] hover:bg-[#b03934] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-[#D04741]/20"
          >
            <Plus size={16} />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="space-y-4">
        {progress.map((item) => (
          <div
            key={item.id}
            className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all flex flex-col md:flex-row gap-5 items-start"
          >
            {item.image && (
              <div className="relative w-full md:w-64 aspect-video rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/10">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized={item.image.startsWith('data:') || item.image.startsWith('http')}
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-[#ff7973] font-bold mb-1">
                <Calendar size={13} />
                <span>{item.date}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end md:self-start shrink-0">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                title="Edit"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {progress.length === 0 && (
          <div className="py-16 text-center bg-[#1c1c1c] rounded-xl border border-white/10">
            <TrendingUp size={32} className="mx-auto text-gray-500 mb-2" />
            <p className="text-sm font-semibold text-gray-400">No milestones posted yet</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h2 className="text-base font-bold text-white font-montserrat">
                {editingItem ? 'Edit Milestone' : 'New Milestone'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Fuselage Prototyping Complete"
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                />
              </div>

              <ImageUploader
                label="Milestone Media / Photo"
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                recommendedSize="16:9 Landscape"
              />

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the milestone achievements..."
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                />
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
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[#D04741] text-white text-xs font-bold transition-all shadow-lg shadow-[#D04741]/20 flex items-center gap-1.5"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Milestone</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

