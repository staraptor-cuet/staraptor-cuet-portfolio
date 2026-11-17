'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  Star,
  ExternalLink,
  Mail,
  Loader2,
  X,
  AlertCircle
} from 'lucide-react';
import { CrewMember } from '@/lib/types';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminCrewPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [search, setSearch] = useState('');
  const [filterBatch, setFilterBatch] = useState('ALL');
  const [filterLead, setFilterLead] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CrewMember | null>(null);
  const [isCustomDesignation, setIsCustomDesignation] = useState(false);
  const [formData, setFormData] = useState<Partial<CrewMember>>({
    name: '',
    designation: '',
    batch: 'ME-22',
    email: '',
    linkedin: '',
    image: '',
    isLead: false,
  });

  const PRESET_DESIGNATIONS = [
    'Chief Advisor',
    'Advisor',
    'Instructor',
    'Project Lead',
    'Design Team Lead',
    'Design Team',
    'Simulation Team Lead',
    'Simulation Team',
    'Research Team Lead',
    'Research Team',
    'Software Team Lead',
    'Software Team',
    'Branding & Communication Team Lead',
    'Branding & Communication Team',
    'Documentation Team Lead',
    'Documentation Team',
  ];

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.crew) setCrew(data.crew);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const saveCrew = async (updatedCrew: CrewMember[]) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'crew', data: updatedCrew }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save');
      setCrew(updatedCrew);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setIsCustomDesignation(false);
    setFormData({
      id: `member-${Date.now()}`,
      name: '',
      designation: 'Design Team',
      batch: 'ME-22',
      email: '',
      linkedin: '',
      image: '',
      isLead: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (member: CrewMember) => {
    setEditingMember(member);
    setIsCustomDesignation(
      Boolean(member.designation && !PRESET_DESIGNATIONS.includes(member.designation))
    );
    setFormData({ ...member });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to remove this crew member?')) return;
    const updated = crew.filter((m) => m.id !== id);
    saveCrew(updated);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.designation) {
      alert('Name and Designation are required.');
      return;
    }

    let updated: CrewMember[];
    if (editingMember) {
      updated = crew.map((m) => (m.id === editingMember.id ? ({ ...formData } as CrewMember) : m));
    } else {
      updated = [{ ...formData, id: `member-${Date.now()}` } as CrewMember, ...crew];
    }

    setModalOpen(false);
    saveCrew(updated);
  };

  const filteredCrew = crew.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.designation.toLowerCase().includes(search.toLowerCase()) ||
      m.batch.toLowerCase().includes(search.toLowerCase());
    const matchesBatch = filterBatch === 'ALL' || m.batch === filterBatch;
    const matchesLead = !filterLead || m.isLead;
    return matchesSearch && matchesBatch && matchesLead;
  });

  const batches = Array.from(new Set(crew.map((m) => m.batch).filter(Boolean)));

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#D04741] mx-auto mb-2" />
        <p className="text-sm text-gray-400">Loading Crew Directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-montserrat">Crew & Team Members</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage your engineers, sub-team leads, designations, batch years, and social profiles.
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
            onClick={handleOpenAdd}
            className="bg-[#D04741] hover:bg-[#b03934] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#D04741]/20 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus size={16} />
            <span className="whitespace-nowrap">Add Member</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, designation, or batch..."
            className="w-full bg-[#141414] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#D04741]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            className="bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
          >
            <option value="ALL">All Batches</option>
            {batches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <button
            onClick={() => setFilterLead(!filterLead)}
            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
              filterLead
                ? 'bg-[#D04741]/20 border-[#D04741] text-[#ff7973]'
                : 'bg-[#141414] border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Star size={13} className={filterLead ? 'fill-[#ff7973]' : ''} />
            <span>Leads Only</span>
          </button>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrew.map((member) => (
          <div
            key={member.id || member.name}
            className="bg-[#1c1c1c] border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-white/20 transition-all relative group"
          >
            {member.isLead && (
              <div className="absolute top-3 right-3 bg-[#D04741]/20 text-[#ff7973] border border-[#D04741]/40 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Star size={10} className="fill-[#ff7973]" /> Lead
              </div>
            )}

            <div className="flex items-start gap-3.5 mb-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    unoptimized={member.image.startsWith('data:') || member.image.startsWith('http')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-lg">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white text-sm truncate">{member.name}</h3>
                <p className="text-xs text-[#D04741] font-semibold truncate">{member.designation}</p>
                <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">
                  {member.batch}
                </span>
              </div>
            </div>

            {/* Social / Email Links */}
            <div className="flex items-center gap-2 mb-4 pt-3 border-t border-white/5 text-xs text-gray-400">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="hover:text-white transition-colors"
                  title={member.email}
                >
                  <Mail size={14} />
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#0077b5] transition-colors"
                  title="LinkedIn Profile"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => handleOpenEdit(member)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-xs flex items-center gap-1 font-semibold"
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-xs flex items-center gap-1 font-semibold"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCrew.length === 0 && (
        <div className="py-16 text-center bg-[#1c1c1c] rounded-xl border border-white/10">
          <Users size={32} className="mx-auto text-gray-500 mb-2" />
          <p className="text-sm font-semibold text-gray-400">No members match your search criteria</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h2 className="text-lg font-bold text-white font-montserrat">
                {editingMember ? 'Edit Crew Member' : 'Add New Crew Member'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Abrar Azmain"
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Designation *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomDesignation(!isCustomDesignation)}
                      className="text-[10px] text-[#EF5F5A] hover:underline transition-colors"
                    >
                      {isCustomDesignation ? '← Select from List' : '+ Custom Entry'}
                    </button>
                  </div>

                  {!isCustomDesignation ? (
                    <select
                      required
                      value={formData.designation || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const isLead = val.includes('Lead') || val.includes('Advisor') || val.includes('Instructor');
                        setFormData({ ...formData, designation: val, isLead });
                      }}
                      className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741] cursor-pointer"
                    >
                      <option value="" disabled>-- Select Designation --</option>
                      <optgroup label="Advisors & Instructors">
                        <option value="Chief Advisor">Chief Advisor</option>
                        <option value="Advisor">Advisor</option>
                        <option value="Instructor">Instructor</option>
                      </optgroup>
                      <optgroup label="Student Leadership">
                        <option value="Project Lead">Project Lead</option>
                      </optgroup>
                      <optgroup label="Design Sub-Team">
                        <option value="Design Team Lead">Design Team Lead</option>
                        <option value="Design Team">Design Team</option>
                      </optgroup>
                      <optgroup label="Simulation Sub-Team">
                        <option value="Simulation Team Lead">Simulation Team Lead</option>
                        <option value="Simulation Team">Simulation Team</option>
                      </optgroup>
                      <optgroup label="Research Sub-Team">
                        <option value="Research Team Lead">Research Team Lead</option>
                        <option value="Research Team">Research Team</option>
                      </optgroup>
                      <optgroup label="Software Sub-Team">
                        <option value="Software Team Lead">Software Team Lead</option>
                        <option value="Software Team">Software Team</option>
                      </optgroup>
                      <optgroup label="Branding & Communication">
                        <option value="Branding & Communication Team Lead">Branding & Communication Team Lead</option>
                        <option value="Branding & Communication Team">Branding & Communication Team</option>
                      </optgroup>
                      <optgroup label="Documentation Sub-Team">
                        <option value="Documentation Team Lead">Documentation Team Lead</option>
                        <option value="Documentation Team">Documentation Team</option>
                      </optgroup>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={formData.designation || ''}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. Aerodynamics Specialist"
                      className="w-full bg-[#121212] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                    />
                  )}

                  {/* 1-Click Quick Toggle Chips */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {[
                      { label: 'Chief Advisor', value: 'Chief Advisor', isLead: true },
                      { label: 'Advisor', value: 'Advisor', isLead: true },
                      { label: 'Instructor', value: 'Instructor', isLead: true },
                      { label: 'Project Lead', value: 'Project Lead', isLead: true },
                      { label: 'Design', base: 'Design Team' },
                      { label: 'Simulation', base: 'Simulation Team' },
                      { label: 'Research', base: 'Research Team' },
                      { label: 'Software', base: 'Software Team' },
                      { label: 'Branding', base: 'Branding & Communication Team' },
                      { label: 'Docs', base: 'Documentation Team' },
                    ].map((item) => {
                      const targetVal = item.value || (formData.isLead ? `${item.base} Lead` : item.base);
                      const isSelected =
                        formData.designation === targetVal ||
                        (!formData.isLead && formData.designation === item.base);

                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setIsCustomDesignation(false);
                            const val = item.value || (formData.isLead ? `${item.base} Lead` : item.base);
                            const lead = item.isLead !== undefined ? item.isLead : Boolean(formData.isLead);
                            setFormData({
                              ...formData,
                              designation: val,
                              isLead: lead,
                            });
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                            isSelected
                              ? 'bg-[#D04741] text-white shadow-sm shadow-[#D04741]/40'
                              : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Batch / Dept
                  </label>
                  <input
                    type="text"
                    value={formData.batch || ''}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    placeholder="e.g. ME-22, ME-23"
                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                  />
                </div>
              </div>

              {/* Photo Uploader */}
              <ImageUploader
                label="Profile Photo (Upload to Cloud/Local)"
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                recommendedSize="1:1 Square recommended"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="member@cuet.ac.bd"
                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin || ''}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isLead || false}
                    onChange={(e) => {
                      const newLead = e.target.checked;
                      let newDesig = formData.designation || '';
                      if (newDesig && newDesig !== 'Project Lead') {
                        if (newLead && !newDesig.includes('Lead')) {
                          newDesig = `${newDesig} Lead`;
                        } else if (!newLead && newDesig.endsWith(' Lead')) {
                          newDesig = newDesig.replace(/ Lead$/, '');
                        }
                      }
                      setFormData({ ...formData, isLead: newLead, designation: newDesig });
                    }}
                    className="rounded border-white/20 text-[#D04741] focus:ring-[#D04741]"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Team Lead Position</span>
                    <span className="text-[11px] text-gray-400">
                      {formData.isLead ? 'Will be tagged as Team Lead & given glowing badge' : 'Standard crew member position'}
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[#D04741] hover:bg-[#b03934] text-white text-xs font-bold transition-all shadow-lg shadow-[#D04741]/20 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

