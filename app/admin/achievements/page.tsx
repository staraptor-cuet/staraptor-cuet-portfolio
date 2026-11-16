'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  Check,
  Calendar,
  Loader2,
  X,
  Star,
  Tag,
  User,
  ArrowUp,
  ArrowDown,
  ExternalLink
} from 'lucide-react';
import { AchievementPost } from '@/lib/types';
import ImageUploader from '@/components/admin/ImageUploader';
import { setPreviewDraft } from '@/lib/preview';

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AchievementPost | null>(null);
  const [formData, setFormData] = useState<Partial<AchievementPost>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Milestone',
    badge: 'National Milestone',
    author: 'Team Staraptor CUET',
    description: '',
    content: '',
    image: '',
    featured: false,
  });

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.achievements) {
          setAchievements(data.achievements);
        } else {
          setAchievements([]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Broadcast real-time preview draft whenever achievements list or item changes
  useEffect(() => {
    if (!loading) {
      setPreviewDraft('achievements', achievements);
    }
  }, [achievements, loading]);

  const saveAchievements = async (updated: AchievementPost[]) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'achievements', data: updated }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save achievements');
      setAchievements(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving achievements');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Milestone',
      badge: 'National Milestone',
      author: 'Team Staraptor CUET',
      description: '',
      content: '',
      image: '',
      featured: achievements.length === 0, // default first one to featured
    });
    setModalOpen(true);
  };

  const openEditModal = (item: AchievementPost) => {
    setEditingItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Title is required');
      return;
    }

    let updated: AchievementPost[];

    if (editingItem) {
      updated = achievements.map((item) =>
        item.id === editingItem.id ? ({ ...item, ...formData } as AchievementPost) : item
      );
    } else {
      const newItem: AchievementPost = {
        id: `ach-${Date.now()}`,
        title: formData.title || '',
        date: formData.date || new Date().toISOString().split('T')[0],
        category: formData.category || 'Milestone',
        badge: formData.badge || 'National Milestone',
        author: formData.author || 'Team Staraptor CUET',
        description: formData.description || '',
        content: formData.content || '',
        image: formData.image || '',
        featured: Boolean(formData.featured),
        createdAt: new Date().toISOString(),
      };
      // Prepend to top so recent post comes first
      updated = [newItem, ...achievements];
    }

    // If marked featured, we can ensure it is top or flagged
    await saveAchievements(updated);
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement post?')) return;
    const updated = achievements.filter((a) => a.id !== id);
    await saveAchievements(updated);
  };

  const toggleFeatured = async (id: string) => {
    const updated = achievements.map((item) => {
      if (item.id === id) {
        return { ...item, featured: !item.featured };
      }
      return item;
    });
    await saveAchievements(updated);
  };

  const moveItem = async (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= achievements.length) return;
    const updated = [...achievements];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    await saveAchievements(updated);
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D04741] mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading Achievements & Newsfeed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-[#D04741]/10 text-[#EF5F5A]">
              <Award size={20} />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-montserrat">
              Achievements & Posts
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            Publish FB-style updates, competitive awards, flight test milestones, and team announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <Check size={14} /> Saved & Synced
            </span>
          )}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D04741] to-[#EF5F5A] text-white text-sm font-bold shadow-lg shadow-[#D04741]/20 hover:opacity-95 transition-opacity"
          >
            <Plus size={16} />
            <span>Create New Post</span>
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#1c1c1c] text-xs text-gray-400 flex items-center justify-between">
        <span>
          💡 <strong>Layout Hint:</strong> On the public Achievements page, the top post is displayed in a <strong>larger featured card format</strong> (like a hero Facebook post), followed by all subsequent posts in the chronological social feed.
        </span>
        <a
          href="/achievements"
          target="_blank"
          rel="noreferrer"
          className="text-[#EF5F5A] hover:underline flex items-center gap-1 font-semibold shrink-0 ml-4"
        >
          <span>View Public Page</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Post List */}
      {achievements.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-[#181818]">
          <Award size={40} className="text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No achievement posts yet</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
            The Achievements page is currently empty. Click the button below to publish your first flight report or milestone!
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D04741] text-white text-xs font-bold hover:bg-[#b83c37] transition-colors"
          >
            <Plus size={14} /> Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map((item, idx) => (
            <div
              key={item.id}
              className={`p-5 rounded-xl border transition-all ${
                idx === 0
                  ? 'border-[#D04741]/50 bg-gradient-to-r from-[#241a1a] to-[#1a1a1a] shadow-lg'
                  : 'border-white/10 bg-[#1a1a1a] hover:border-white/20'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-5 items-start justify-between">
                
                {/* Thumbnail / Image Preview */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-24 sm:w-32 h-20 sm:h-24 rounded-lg bg-black/40 border border-white/10 overflow-hidden relative shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 text-[10px]">
                        <Award size={22} className="mb-1" />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#D04741] text-white">
                          ★ Top Featured Post
                        </span>
                      )}
                      {item.featured && idx !== 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Pinned
                        </span>
                      )}
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-gray-300">
                          {item.badge}
                        </span>
                      )}
                      {item.category && (
                        <span className="text-[10px] font-mono text-[#EF5F5A]">
                          #{item.category}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 font-mono flex items-center gap-1 ml-auto">
                        <Calendar size={12} /> {item.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-montserrat truncate">
                      {item.title}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {item.description || item.content || 'No description provided.'}
                    </p>

                    <div className="text-[11px] text-gray-500 flex items-center gap-2 pt-1">
                      <span>By: <strong className="text-gray-300">{item.author || 'Team Staraptor CUET'}</strong></span>
                      {item.content && (
                        <>
                          <span>•</span>
                          <span>{item.content.length} characters</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col items-center justify-end gap-1.5 shrink-0 self-end md:self-center">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveItem(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveItem(idx, 'down')}
                      disabled={idx === achievements.length - 1}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFeatured(item.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        item.featured
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-white/5 text-gray-400 hover:text-amber-300 border-white/5'
                      }`}
                      title={item.featured ? 'Unpin' : 'Pin to top'}
                    >
                      <Star size={14} className={item.featured ? 'fill-amber-400' : ''} />
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                      title="Edit post"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1f1f1f]">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#D04741]/20 text-[#EF5F5A]">
                  <Award size={18} />
                </span>
                <h2 className="text-base font-bold text-white font-montserrat">
                  {editingItem ? 'Edit Achievement Post' : 'Create New Achievement Post'}
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
              
              {/* Post Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Post Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1st VTOL Drone Design Team in Bangladesh"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D04741] transition-colors"
                />
              </div>

              {/* Grid: Date, Category, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="2026 or 2026-03-15"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="Milestone, Flight Test, Award"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    placeholder="National Milestone, Record"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741]"
                  />
                </div>
              </div>

              {/* Author */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Author / Organization
                </label>
                <input
                  type="text"
                  placeholder="Team Staraptor CUET"
                  value={formData.author || ''}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741]"
                />
              </div>

              {/* Image Uploader */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Post Cover / Attached Image
                </label>
                <ImageUploader
                  value={formData.image || ''}
                  onChange={(url: string) => setFormData({ ...formData, image: url })}
                  label="Upload Post Image"
                  recommendedSize="1200 x 675 (16:9 widescreen recommended)"
                />
              </div>

              {/* Short Summary */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Short Summary / Excerpt
                </label>
                <input
                  type="text"
                  placeholder="A one-line punchy summary of the milestone or breakthrough..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741]"
                />
              </div>

              {/* Full Description / Post Content (FB Style) */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Story / Narrative (Social Post Body)
                </label>
                <textarea
                  rows={5}
                  placeholder="Share the full story, engineering breakthroughs, team challenges overcome, partner mentions, and next steps..."
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D04741] leading-relaxed resize-y"
                />
              </div>

              {/* Pin to Top Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={Boolean(formData.featured)}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#D04741] focus:ring-[#D04741] bg-black/40 border-white/20"
                />
                <label htmlFor="featured-check" className="text-xs text-gray-300 cursor-pointer select-none">
                  Pin / Highlight as Featured Achievement
                </label>
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
                  <span>{editingItem ? 'Update Post' : 'Publish Post'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
