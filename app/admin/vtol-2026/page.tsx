'use client';

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Save,
  Plus,
  Trash2,
  Check,
  Loader2
} from 'lucide-react';
import { VtolCompetition } from '@/lib/types';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminVtolPage() {
  const [vtol, setVtol] = useState<VtolCompetition | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.vtol2026) setVtol(data.vtol2026);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!vtol) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'vtol2026', data: vtol }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving competition details');
    } finally {
      setSaving(false);
    }
  };

  const addRequirement = () => {
    if (!vtol) return;
    setVtol({
      ...vtol,
      requirements: [
        ...vtol.requirements,
        { title: 'New Requirement', description: 'Describe technical regulation or rule...' },
      ],
    });
  };

  const deleteRequirement = (index: number) => {
    if (!vtol) return;
    setVtol({
      ...vtol,
      requirements: vtol.requirements.filter((_, i) => i !== index),
    });
  };

  if (loading || !vtol) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#D04741] mx-auto mb-2" />
        <p className="text-sm text-gray-400">Loading VTOL 2026 Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-montserrat">METU VTOL-2026 Objective</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage the international competition overview, official poster, and mission specifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <Check size={14} /> Saved Live!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#D04741] hover:bg-[#b03934] text-white px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-[#D04741]/20 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save VTOL Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Overview & Poster */}
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy size={16} className="text-[#D04741]" />
            Competition Brief
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={vtol.title}
                onChange={(e) => setVtol({ ...vtol, title: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Subtitle</label>
              <input
                type="text"
                value={vtol.subtitle}
                onChange={(e) => setVtol({ ...vtol, subtitle: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Overview Description</label>
            <textarea
              rows={4}
              value={vtol.overviewText}
              onChange={(e) => setVtol({ ...vtol, overviewText: e.target.value })}
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
            />
          </div>

          <ImageUploader
            label="Competition Poster / Graphic"
            value={vtol.posterImage}
            onChange={(url) => setVtol({ ...vtol, posterImage: url })}
            recommendedSize="High-resolution poster image"
          />
        </div>

        {/* Right Column: Requirements & Regulations */}
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Mission & Aircraft Regulations
              </h2>
              <p className="text-xs text-gray-400">Rules mandated by the competition committee</p>
            </div>
            <button
              type="button"
              onClick={addRequirement}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1"
            >
              <Plus size={14} /> Add Rule
            </button>
          </div>

          <div className="space-y-3">
            {vtol.requirements.map((req, idx) => (
              <div key={idx} className="bg-[#121212] p-3.5 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={req.title}
                    onChange={(e) => {
                      const updated = [...vtol.requirements];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setVtol({ ...vtol, requirements: updated });
                    }}
                    placeholder="Requirement Title"
                    className="flex-1 bg-transparent font-bold text-xs text-[#D04741] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => deleteRequirement(idx)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={req.description}
                  onChange={(e) => {
                    const updated = [...vtol.requirements];
                    updated[idx] = { ...updated[idx], description: e.target.value };
                    setVtol({ ...vtol, requirements: updated });
                  }}
                  placeholder="Requirement details..."
                  className="w-full bg-[#181818] border border-white/10 rounded px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

