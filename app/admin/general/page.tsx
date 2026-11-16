'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Save,
  Check,
  Loader2,
  Share2,
  Mail,
  FileText,
  BarChart3,
  Plus,
  Trash2
} from 'lucide-react';
import { GeneralSettings } from '@/lib/types';
import { setPreviewDraft } from '@/lib/preview';

export default function AdminGeneralPage() {
  const [general, setGeneral] = useState<GeneralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.general) setGeneral(data.general);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Broadcast real-time preview draft whenever admin modifies form values
  useEffect(() => {
    if (general && !loading) {
      setPreviewDraft('general', general);
    }
  }, [general, loading]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!general) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'general', data: general }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleStatChange = (idx: number, field: 'label' | 'value' | 'labelFirst', val: any) => {
    if (!general) return;
    const updated = [...general.stats];
    updated[idx] = { ...updated[idx], [field]: val };
    setGeneral({ ...general, stats: updated });
  };

  const addStat = () => {
    if (!general) return;
    setGeneral({
      ...general,
      stats: [
        ...general.stats,
        { id: `stat-${Date.now()}`, label: 'Stat Name', value: '100', labelFirst: true },
      ],
    });
  };

  const deleteStat = (idx: number) => {
    if (!general) return;
    setGeneral({
      ...general,
      stats: general.stats.filter((_, i) => i !== idx),
    });
  };

  if (loading || !general) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#D04741] mx-auto mb-2" />
        <p className="text-sm text-gray-400">Loading Site Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-montserrat">General Settings & Copy</h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure homepage hero typography, mission statement, landing stats counters, and contact links.
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
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Homepage Hero & Mission */}
        <div className="space-y-6">
          <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders size={16} className="text-[#D04741]" />
              Hero Headline
            </h2>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Main Tagline
              </label>
              <input
                type="text"
                value={general.tagline}
                onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                About Section Heading
              </label>
              <input
                type="text"
                value={general.aboutTitle}
                onChange={(e) => setGeneral({ ...general, aboutTitle: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                About / Mission Statement
              </label>
              <textarea
                rows={6}
                value={general.aboutDescription}
                onChange={(e) => setGeneral({ ...general, aboutDescription: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741] leading-relaxed"
              />
            </div>
          </div>

          {/* Contact & Proposals */}
          <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-[#ff7973]" />
              Proposal & Contact Channels
            </h2>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Official Proposal URL (Google Drive / Direct PDF)
              </label>
              <input
                type="url"
                value={general.proposalUrl}
                onChange={(e) => setGeneral({ ...general, proposalUrl: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Official Contact Email
              </label>
              <input
                type="email"
                value={general.contactEmail}
                onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Direct Contact Phone
              </label>
              <input
                type="text"
                placeholder="+880 1972-723321"
                value={general.contactPhone || ''}
                onChange={(e) => setGeneral({ ...general, contactPhone: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Headquarters Address
              </label>
              <input
                type="text"
                placeholder="Kaptai Highway, Raozan, Pahartoli Road, Chattogram 4349, Bangladesh"
                value={general.headquarters || ''}
                onChange={(e) => setGeneral({ ...general, headquarters: e.target.value })}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Social Links */}
        <div className="space-y-6">
          {/* Landing Page Stats */}
          <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 size={16} className="text-emerald-400" />
                Landing Page Stats
              </h2>
              <button
                type="button"
                onClick={addStat}
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <Plus size={12} /> Add Counter
              </button>
            </div>

            <div className="space-y-3">
              {general.stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#121212] p-2.5 rounded-lg border border-white/5">
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    placeholder="Label (e.g. Crew Size)"
                    className="flex-1 bg-[#181818] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    placeholder="Value (e.g. 20)"
                    className="w-24 bg-[#181818] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono text-center font-bold text-[#D04741]"
                  />
                  <button
                    type="button"
                    onClick={() => deleteStat(idx)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Profiles */}
          <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Share2 size={16} className="text-blue-400" />
              Social Media Accounts
            </h2>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Facebook Page</label>
              <input
                type="url"
                value={general.socials.facebook}
                onChange={(e) =>
                  setGeneral({
                    ...general,
                    socials: { ...general.socials, facebook: e.target.value },
                  })
                }
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">LinkedIn Company</label>
              <input
                type="url"
                value={general.socials.linkedin}
                onChange={(e) =>
                  setGeneral({
                    ...general,
                    socials: { ...general.socials, linkedin: e.target.value },
                  })
                }
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Instagram</label>
              <input
                type="url"
                value={general.socials.instagram}
                onChange={(e) =>
                  setGeneral({
                    ...general,
                    socials: { ...general.socials, instagram: e.target.value },
                  })
                }
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">YouTube</label>
              <input
                type="url"
                value={general.socials.youtube}
                onChange={(e) =>
                  setGeneral({
                    ...general,
                    socials: { ...general.socials, youtube: e.target.value },
                  })
                }
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

