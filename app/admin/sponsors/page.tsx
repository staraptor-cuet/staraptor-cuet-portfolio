'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Handshake,
  Plus,
  Trash2,
  Edit2,
  Check,
  ExternalLink,
  Loader2,
  X,
  Layers
} from 'lucide-react';
import { SponsorTier, SponsorItem } from '@/lib/types';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminSponsorsPage() {
  const [tiers, setTiers] = useState<SponsorTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [targetTierId, setTargetTierId] = useState<string>('');
  const [editingSponsor, setEditingSponsor] = useState<SponsorItem | null>(null);
  const [sponsorForm, setSponsorForm] = useState<Partial<SponsorItem>>({
    name: '',
    logo: '',
    website: '',
  });

  // Tier Modal State
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [newTierTitle, setNewTierTitle] = useState('');
  const [newTierCount, setNewTierCount] = useState(2);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.sponsors) setTiers(data.sponsors);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const saveTiers = async (updatedTiers: SponsorTier[]) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'sponsors', data: updatedTiers }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save');
      setTiers(updatedTiers);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving sponsors');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAddSponsor = (tierId: string) => {
    setTargetTierId(tierId);
    setEditingSponsor(null);
    setSponsorForm({ id: `sp-${Date.now()}`, name: '', logo: '', website: '' });
    setModalOpen(true);
  };

  const handleOpenEditSponsor = (tierId: string, sponsor: SponsorItem) => {
    setTargetTierId(tierId);
    setEditingSponsor(sponsor);
    setSponsorForm({ ...sponsor });
    setModalOpen(true);
  };

  const handleDeleteSponsor = (tierId: string, sponsorId: string) => {
    if (!confirm('Are you sure you want to remove this sponsor?')) return;
    const updated = tiers.map((tier) => {
      if (tier.id !== tierId) return tier;
      return {
        ...tier,
        sponsors: tier.sponsors.filter((s) => s.id !== sponsorId),
      };
    });
    saveTiers(updated);
  };

  const handleSaveSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorForm.name) {
      alert('Sponsor name is required.');
      return;
    }

    const updated = tiers.map((tier) => {
      if (tier.id !== targetTierId) return tier;

      let newSponsorsList = [...tier.sponsors];
      if (editingSponsor) {
        newSponsorsList = newSponsorsList.map((s) =>
          s.id === editingSponsor.id ? ({ ...sponsorForm } as SponsorItem) : s
        );
      } else {
        newSponsorsList.push({ ...sponsorForm, id: `sp-${Date.now()}` } as SponsorItem);
      }

      return {
        ...tier,
        sponsors: newSponsorsList,
        count: Math.max(tier.count, newSponsorsList.length),
      };
    });

    setModalOpen(false);
    saveTiers(updated);
  };

  const handleAddTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTierTitle) return;

    const newTier: SponsorTier = {
      id: `tier-${Date.now()}`,
      title: newTierTitle,
      count: Number(newTierCount) || 1,
      sponsors: [],
    };

    saveTiers([...tiers, newTier]);
    setNewTierTitle('');
    setTierModalOpen(false);
  };

  const handleDeleteTier = (tierId: string) => {
    if (!confirm('Are you sure you want to delete this whole tier?')) return;
    saveTiers(tiers.filter((t) => t.id !== tierId));
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#D04741] mx-auto mb-2" />
        <p className="text-sm text-gray-400">Loading Sponsors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-montserrat">Sponsors & Partners</h1>
          <p className="text-xs text-gray-400 mt-1">
            Organize partners by tiers, upload company logos, and link to corporate websites.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 whitespace-nowrap">
              <Check size={14} /> Saved Live!
            </span>
          )}
          <button
            type="button"
            onClick={() => setTierModalOpen(true)}
            className="bg-[#D04741] hover:bg-[#b03934] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-[#D04741]/20 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus size={16} />
            <span className="whitespace-nowrap">Add New Tier</span>
          </button>
        </div>
      </div>

      {/* Tiers List */}
      <div className="space-y-6">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-[#D04741] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                  {tier.title}
                </span>
                <span className="text-xs text-gray-400">
                  {tier.sponsors.length} / {tier.count} slots filled
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAddSponsor(tier.id)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>Add Sponsor</span>
                </button>
                <button
                  onClick={() => handleDeleteTier(tier.id)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Tier"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Sponsors Grid in this tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tier.sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="bg-[#141414] border border-white/10 rounded-xl p-4 flex flex-col justify-between group hover:border-[#D04741]/40 transition-colors"
                >
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-white/5 flex items-center justify-center mb-3 p-2">
                    {sponsor.logo ? (
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        fill
                        className="object-contain p-2"
                        unoptimized={sponsor.logo.startsWith('data:') || sponsor.logo.startsWith('http')}
                      />
                    ) : (
                      <span className="text-xs text-gray-500 font-bold uppercase">No Logo</span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm truncate">{sponsor.name}</h4>
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#ff7973] hover:underline flex items-center gap-1 mt-1 truncate"
                      >
                        <ExternalLink size={12} />
                        <span>Visit Website</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5 mt-3">
                    <button
                      onClick={() => handleOpenEditSponsor(tier.id, sponsor)}
                      className="p-1 text-gray-400 hover:text-white"
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteSponsor(tier.id, sponsor.id)}
                      className="p-1 text-red-400 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}

              {tier.sponsors.length === 0 && (
                <div className="col-span-full py-8 text-center bg-[#141414] rounded-lg border border-dashed border-white/10">
                  <p className="text-xs text-gray-500 font-semibold mb-2">
                    No active sponsors in this tier yet (Displays as &quot;To Be Announced&quot; on website)
                  </p>
                  <button
                    onClick={() => handleOpenAddSponsor(tier.id)}
                    className="text-xs text-[#D04741] font-bold hover:underline"
                  >
                    + Add a sponsor now
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Sponsor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h2 className="text-base font-bold text-white font-montserrat">
                {editingSponsor ? 'Edit Sponsor' : 'Add Sponsor'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSponsor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Company / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={sponsorForm.name || ''}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                  placeholder="e.g. Epic Properties Ltd."
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                />
              </div>

              <ImageUploader
                label="Company Logo (PNG / SVG with transparent background)"
                value={sponsorForm.logo || ''}
                onChange={(url) => setSponsorForm({ ...sponsorForm, logo: url })}
                recommendedSize="Landscape or square logo"
              />

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Website URL
                </label>
                <input
                  type="url"
                  value={sponsorForm.website || ''}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, website: e.target.value })}
                  placeholder="https://..."
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
                  <span>Save Sponsor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Tier Modal */}
      {tierModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h2 className="text-base font-bold text-white font-montserrat">Add New Sponsor Tier</h2>
              <button onClick={() => setTierModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddTier} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Tier Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTierTitle}
                  onChange={(e) => setNewTierTitle(e.target.value)}
                  placeholder="e.g. Gold Partners, Media Partners"
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Initial Placeholder Cards Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newTierCount}
                  onChange={(e) => setNewTierCount(Number(e.target.value))}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setTierModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#D04741] text-white text-xs font-bold transition-all shadow-lg shadow-[#D04741]/20"
                >
                  Create Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

