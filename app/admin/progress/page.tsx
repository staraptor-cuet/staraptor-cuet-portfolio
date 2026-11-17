'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  TrendingUp,
  Plane,
  Plus,
  Trash2,
  Edit2,
  Check,
  Loader2,
  X,
  Layers,
  Activity,
  Cpu,
  ArrowRight,
  Save,
  HelpCircle
} from 'lucide-react';
import {
  ProgressProject,
  SpecItem,
  AvionicsItem,
  ComponentItem,
  AnalysisItem,
  DynamicSection
} from '@/lib/types';
import ImageUploader from '@/components/admin/ImageUploader';

function AdminProgressProjectsContent() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<ProgressProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editor Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProgressProject | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'components' | 'cfd' | 'custom'>('overview');

  // Form State
  const [formData, setFormData] = useState<ProgressProject>({
    id: '',
    slug: '',
    name: '',
    category: 'FEATURED PROJECT: Active Aerospace Platform',
    competition: 'METU VTOL 2026',
    summary: '',
    heroImage: '/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png',
    badges: ['HYBRID VTOL', 'TILT-ROTOR', 'MODEL 1 ACTIVE'],
    statusText: 'Active Prototype & Flight Ready',
    date: new Date().toISOString().split('T')[0],
    featured: true,
    physicalData: [],
    performanceData: [],
    avionics: [],
    components: [],
    analyses: [],
    customSections: [],
  });

  const [badgeInput, setBadgeInput] = useState('');

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        } else if (data.aircraft) {
          // Fallback initial project from aircraft if projects not set
          const initialProj: ProgressProject = {
            id: 'staraptor-vtol-v1',
            slug: 'vtol-v1',
            name: data.aircraft.name || 'STARAPTOR VTOL - V1',
            category: 'FEATURED PROJECT: Active Aerospace Platform',
            competition: 'METU VTOL 2026',
            summary:
              'Flagship hybrid tilt-rotor VTOL aircraft engineered for the 9th METU Competition. Combines fixed-wing aerodynamic cruise speed with vertical hover precision and autonomous maritime delivery.',
            heroImage: data.aircraft.heroImage || '/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png',
            badges: ['HYBRID VTOL', 'TILT-ROTOR', 'MODEL 1 ACTIVE', 'AUTONOMOUS'],
            statusText: 'Active Prototype & Flight Ready',
            date: '2026-03-01',
            featured: true,
            physicalData: data.aircraft.physicalData || [],
            performanceData: data.aircraft.performanceData || [],
            avionics: data.aircraft.avionics || [],
            components: data.aircraft.components || [],
            analyses: data.aircraft.analyses || [],
            customSections: [],
          };
          setProjects([initialProj]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Check URL query param e.g. /admin/progress?edit=staraptor-vtol-v1
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && projects.length > 0) {
      const match = projects.find((p) => p.id === editId || p.slug === editId);
      if (match) {
        handleOpenEdit(match);
      }
    }
  }, [searchParams, projects]);

  const saveProjects = async (updatedProjects: ProgressProject[]) => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      // Also sync first project with aircraft specs for legacy compatibility
      const primaryProject = updatedProjects[0];
      const aircraftPayload = primaryProject
        ? {
            classification: 'Unmanned Aerial Vehicle',
            name: primaryProject.name,
            heroImage: primaryProject.heroImage,
            physicalData: primaryProject.physicalData,
            performanceData: primaryProject.performanceData,
            avionics: primaryProject.avionics,
            components: primaryProject.components,
            analyses: primaryProject.analyses,
          }
        : null;

      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'projects',
          data: updatedProjects,
        }),
      });

      if (aircraftPayload) {
        await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: 'aircraft',
            data: aircraftPayload,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save');

      setProjects(updatedProjects);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving projects');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    const newId = `project-${Date.now()}`;
    setFormData({
      id: newId,
      slug: `aircraft-${projects.length + 1}`,
      name: `STARAPTOR VTOL - V${projects.length + 1}`,
      category: 'AEROSPACE PLATFORM',
      competition: 'METU VTOL 2026',
      summary:
        'Next-generation autonomous VTOL flight platform designed for extreme endurance and high payload operations.',
      heroImage: '/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png',
      badges: ['HYBRID VTOL', 'PROTOTYPE', 'AUTONOMOUS'],
      statusText: 'In Development',
      date: new Date().toISOString().split('T')[0],
      featured: false,
      physicalData: [
        { id: `pd-${Date.now()}-1`, label: 'Wingspan', value: '1.50 m' },
        { id: `pd-${Date.now()}-2`, label: 'Length', value: '1.10 m' },
        { id: `pd-${Date.now()}-3`, label: 'Payload Capacity', value: '10 Kg' },
        { id: `pd-${Date.now()}-4`, label: 'Approximate Weight', value: '2.5 Kg' },
      ],
      performanceData: [
        { id: `perf-${Date.now()}-1`, label: 'Cruise Speed', value: '75 Kmph' },
        { id: `perf-${Date.now()}-2`, label: 'Endurance', value: '120 min' },
      ],
      avionics: [
        { id: `av-${Date.now()}-1`, title: 'Composite Construction', desc: 'Carbon fiber and lightweight 3D printed structures' },
        { id: `av-${Date.now()}-2`, title: 'Flight Controller', desc: 'Pixhawk 6X Autopilot with redundant sensors' },
      ],
      components: [
        { name: 'Brushless Propulsion Motors', desc: 'High-efficiency motors for VTOL lift and forward thrust' },
        { name: 'Lithium Polymer Battery Pack', desc: 'High-density power system for extended flight envelope' },
      ],
      analyses: [],
      customSections: [],
    });
    setBadgeInput('HYBRID VTOL, PROTOTYPE, AUTONOMOUS');
    setActiveTab('overview');
    setModalOpen(true);
  };

  const handleOpenEdit = (project: ProgressProject) => {
    setEditingProject(project);
    setFormData(JSON.parse(JSON.stringify(project))); // Deep clone
    setBadgeInput(project.badges?.join(', ') || '');
    setActiveTab('overview');
    setModalOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) {
      alert('You must keep at least 1 aircraft project on the platform.');
      return;
    }
    if (!confirm('Are you sure you want to delete this aircraft project? This will also remove its specifications.')) return;
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Project Name is required');
      return;
    }

    const badgesArray = badgeInput
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    const updatedFormData: ProgressProject = {
      ...formData,
      badges: badgesArray,
    };

    let updated: ProgressProject[];
    if (editingProject) {
      updated = projects.map((p) => (p.id === editingProject.id ? updatedFormData : p));
    } else {
      updated = [updatedFormData, ...projects];
    }

    saveProjects(updated);
    setModalOpen(false);
  };

  // Helper row adders/removers for Default Specs
  const addPhysicalRow = () => {
    setFormData({
      ...formData,
      physicalData: [...(formData.physicalData || []), { id: `pd-${Date.now()}`, label: 'Metric', value: 'Value' }],
    });
  };

  const deletePhysicalRow = (idx: number) => {
    setFormData({
      ...formData,
      physicalData: formData.physicalData.filter((_, i) => i !== idx),
    });
  };

  const addPerformanceRow = () => {
    setFormData({
      ...formData,
      performanceData: [...(formData.performanceData || []), { id: `perf-${Date.now()}`, label: 'Metric', value: 'Value' }],
    });
  };

  const deletePerformanceRow = (idx: number) => {
    setFormData({
      ...formData,
      performanceData: formData.performanceData.filter((_, i) => i !== idx),
    });
  };

  const addAvionicsRow = () => {
    setFormData({
      ...formData,
      avionics: [...(formData.avionics || []), { id: `av-${Date.now()}`, title: 'System Title', desc: 'Description of system' }],
    });
  };

  const deleteAvionicsRow = (idx: number) => {
    setFormData({
      ...formData,
      avionics: formData.avionics.filter((_, i) => i !== idx),
    });
  };

  const addComponentRow = () => {
    setFormData({
      ...formData,
      components: [...(formData.components || []), { name: 'Part Name', desc: 'Part description and function' }],
    });
  };

  const deleteComponentRow = (idx: number) => {
    setFormData({
      ...formData,
      components: formData.components.filter((_, i) => i !== idx),
    });
  };

  const addAnalysisRow = () => {
    setFormData({
      ...formData,
      analyses: [...(formData.analyses || []), { src: '/images/analysis-img-1.png', alt: 'CFD Analysis', caption: 'Flow distribution & pressure metrics' }],
    });
  };

  const deleteAnalysisRow = (idx: number) => {
    setFormData({
      ...formData,
      analyses: formData.analyses.filter((_, i) => i !== idx),
    });
  };

  // Custom Dynamic Section Helpers
  const addCustomSection = (type: 'specs' | 'components' | 'text') => {
    const newSec: DynamicSection = {
      id: `sec-${Date.now()}`,
      title: type === 'specs' ? 'Custom Specifications' : type === 'components' ? 'Additional Hardware & Parts' : 'Engineering Notes & Analysis',
      type,
      specs: type === 'specs' ? [{ id: `sp-${Date.now()}`, label: 'Custom Metric', value: 'Value' }] : undefined,
      components: type === 'components' ? [{ name: 'Custom Component', desc: 'Function description' }] : undefined,
      content: type === 'text' ? 'Write detailed engineering documentation or requirements here.' : undefined,
    };

    setFormData({
      ...formData,
      customSections: [...(formData.customSections || []), newSec],
    });
  };

  const deleteCustomSection = (secIdx: number) => {
    if (!confirm('Are you sure you want to delete this custom section?')) return;
    setFormData({
      ...formData,
      customSections: formData.customSections?.filter((_, i) => i !== secIdx),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-[#D04741]/10 text-[#EF5F5A]">
              <TrendingUp size={20} />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-montserrat text-white">
              Our Progress & Aircraft Fleet Management
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Manage your VTOL aircraft platforms, preview summary cards, engineering specifications, BOM components, and custom technical sections.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-fade-in whitespace-nowrap">
              <Check size={14} /> Changes Saved Live!
            </span>
          )}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D04741] to-[#EF5F5A] hover:opacity-95 text-white text-xs font-bold transition-all shadow-lg shadow-[#D04741]/20 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus size={16} />
            <span className="whitespace-nowrap">Add Aircraft Project from Scratch</span>
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start gap-3">
        <HelpCircle size={18} className="text-[#EF5F5A] shrink-0 mt-0.5" />
        <p className="text-xs text-gray-300 leading-relaxed">
          <strong className="text-white">How it displays on the public website:</strong> Visitors clicking <strong>Our Progress</strong> will first see a sleek <strong>Summary Card Box</strong> with cover render, badges, and quick metrics. When they click on it, the full engineering specifications, BOM component list, and custom sections will smoothly open.
        </p>
      </div>

      {/* Project Cards List */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="animate-spin text-[#D04741] mx-auto mb-3" size={24} />
          <p className="text-xs text-gray-400 font-mono">Loading aircraft fleet...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, index) => (
            <div
              key={proj.id || index}
              className="bg-[#1c1c1c] border border-white/10 hover:border-white/20 rounded-2xl p-5 shadow-xl transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                {/* Image and Identity */}
                <div className="flex items-start gap-4">
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                    <Image
                      src={proj.heroImage || '/images/9f0826138db81f3fd3a81d12f0d6df8086daaca0.png'}
                      alt={proj.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 block animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#EF5F5A] font-bold">
                        {proj.category || 'Active Platform'}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {proj.statusText || 'Active Prototype'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white font-montserrat">
                      {proj.name}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-2 mt-1 max-w-xl">
                      {proj.summary}
                    </p>

                    {/* Stats pills */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-[10px] font-mono bg-white/5 border border-white/5 text-gray-300 px-2 py-0.5 rounded">
                        {proj.physicalData?.length || 0} Physical Specs
                      </span>
                      <span className="text-[10px] font-mono bg-white/5 border border-white/5 text-gray-300 px-2 py-0.5 rounded">
                        {proj.performanceData?.length || 0} Performance Specs
                      </span>
                      <span className="text-[10px] font-mono bg-white/5 border border-white/5 text-gray-300 px-2 py-0.5 rounded">
                        {proj.components?.length || 0} Components
                      </span>
                      {proj.customSections && proj.customSections.length > 0 && (
                        <span className="text-[10px] font-mono bg-[#D04741]/20 border border-[#D04741]/40 text-[#EF5F5A] px-2 py-0.5 rounded font-bold">
                          +{proj.customSections.length} Custom Sections
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors border border-white/10"
                  >
                    <Edit2 size={13} className="text-[#EF5F5A]" />
                    <span>Edit Specs & Sections</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors border border-red-500/20"
                    title="Delete Project"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPREHENSIVE PROJECT & SPECS BUILDER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#181818] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#1f1f1f]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D04741]/20 border border-[#D04741]/40 flex items-center justify-center text-[#EF5F5A] shrink-0">
                  <Plane size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white font-montserrat">
                    {editingProject ? `Edit ${editingProject.name}` : 'Create New Aircraft Project from Scratch'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Configure summary box preview, engineering parameters, BOM components, and dynamic custom sections.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs Bar */}
            <div className="flex items-center gap-1.5 px-6 pt-3 border-b border-white/10 bg-[#151515] overflow-x-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 border-b-2 transition-all shrink-0 ${
                  activeTab === 'overview'
                    ? 'border-[#D04741] text-white font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                1. Card & Identity
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`px-3 py-2 border-b-2 transition-all shrink-0 ${
                  activeTab === 'specs'
                    ? 'border-[#D04741] text-white font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                2. Physical & Performance Specs ({formData.physicalData?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('components')}
                className={`px-3 py-2 border-b-2 transition-all shrink-0 ${
                  activeTab === 'components'
                    ? 'border-[#D04741] text-white font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                3. BOM Components ({formData.components?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('cfd')}
                className={`px-3 py-2 border-b-2 transition-all shrink-0 ${
                  activeTab === 'cfd'
                    ? 'border-[#D04741] text-white font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                4. CFD Analyses ({formData.analyses?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className={`px-3 py-2 border-b-2 transition-all shrink-0 ${
                  activeTab === 'custom'
                    ? 'border-[#D04741] text-white font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                5. Dynamic Custom Sections ({formData.customSections?.length || 0})
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* TAB 1: CARD & OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Aircraft / Project Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. STARAPTOR VTOL - V1"
                        className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Category / Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g. FEATURED PROJECT: Active Aerospace Platform"
                        className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Target Competition / Mission
                      </label>
                      <input
                        type="text"
                        value={formData.competition || ''}
                        onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                        placeholder="e.g. METU VTOL 2026"
                        className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Status Text Badge
                      </label>
                      <input
                        type="text"
                        value={formData.statusText || ''}
                        onChange={(e) => setFormData({ ...formData, statusText: e.target.value })}
                        placeholder="e.g. Active Prototype & Flight Ready"
                        className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Summary (Shown on the Preview Card on Our Progress page) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.summary || ''}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Write a concise overview describing this VTOL aircraft's mission, design innovations, and capabilities..."
                      className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-[#D04741] leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Tag Badges (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={badgeInput}
                      onChange={(e) => setBadgeInput(e.target.value)}
                      placeholder="e.g. HYBRID VTOL, TILT-ROTOR, MODEL 1 ACTIVE, AUTONOMOUS"
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
                    />
                  </div>

                  {/* Hero Image Uploader */}
                  <ImageUploader
                    label="Aircraft Hero Image / 3D Render"
                    value={formData.heroImage || ''}
                    onChange={(url) => setFormData({ ...formData, heroImage: url })}
                    recommendedSize="16:9 Landscape render recommended"
                  />
                </div>
              )}

              {/* TAB 2: PHYSICAL & PERFORMANCE SPECS */}
              {activeTab === 'specs' && (
                <div className="space-y-6">
                  {/* Physical Data */}
                  <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Plane size={16} className="text-[#EF5F5A]" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Physical Dimensions & Weight
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={addPhysicalRow}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#EF5F5A] hover:underline"
                      >
                        <Plus size={13} /> Add Metric
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.physicalData?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Metric (e.g. Wingspan)"
                            value={item.label}
                            onChange={(e) => {
                              const updated = [...formData.physicalData];
                              updated[idx].label = e.target.value;
                              setFormData({ ...formData, physicalData: updated });
                            }}
                            className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. 1.340 m)"
                            value={item.value}
                            onChange={(e) => {
                              const updated = [...formData.physicalData];
                              updated[idx].value = e.target.value;
                              setFormData({ ...formData, physicalData: updated });
                            }}
                            className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => deletePhysicalRow(idx)}
                            className="p-1.5 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Data */}
                  <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Activity size={16} className="text-[#EF5F5A]" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Flight Performance Envelope
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={addPerformanceRow}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#EF5F5A] hover:underline"
                      >
                        <Plus size={13} /> Add Metric
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.performanceData?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Metric (e.g. Cruise Speed)"
                            value={item.label}
                            onChange={(e) => {
                              const updated = [...formData.performanceData];
                              updated[idx].label = e.target.value;
                              setFormData({ ...formData, performanceData: updated });
                            }}
                            className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. 60-70 Kmph)"
                            value={item.value}
                            onChange={(e) => {
                              const updated = [...formData.performanceData];
                              updated[idx].value = e.target.value;
                              setFormData({ ...formData, performanceData: updated });
                            }}
                            className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => deletePerformanceRow(idx)}
                            className="p-1.5 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Avionics & Systems */}
                  <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Cpu size={16} className="text-[#EF5F5A]" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Avionics & Structural Systems
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={addAvionicsRow}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#EF5F5A] hover:underline"
                      >
                        <Plus size={13} /> Add System
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.avionics?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="System Title (e.g. Airfoil)"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...formData.avionics];
                              updated[idx].title = e.target.value;
                              setFormData({ ...formData, avionics: updated });
                            }}
                            className="w-1/3 bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Description (e.g. Eppler E205)"
                            value={item.desc}
                            onChange={(e) => {
                              const updated = [...formData.avionics];
                              updated[idx].desc = e.target.value;
                              setFormData({ ...formData, avionics: updated });
                            }}
                            className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => deleteAvionicsRow(idx)}
                            className="p-1.5 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BOM COMPONENTS */}
              {activeTab === 'components' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Component Bill of Materials (BOM) List
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Detailed hardware, electronics, flight hardware, and structural elements.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addComponentRow}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#D04741] px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Plus size={14} /> Add Component Part
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.components?.map((comp, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#141414] border border-white/5 flex items-start gap-3">
                        <span className="text-xs font-mono text-gray-500 pt-1.5">#{idx + 1}</span>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Part Name (e.g. Brushless Motor / ESC / Pixhawk Autopilot)"
                            value={comp.name}
                            onChange={(e) => {
                              const updated = [...formData.components];
                              updated[idx].name = e.target.value;
                              setFormData({ ...formData, components: updated });
                            }}
                            className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs font-bold"
                          />
                          <textarea
                            rows={2}
                            placeholder="Function / description of this component..."
                            value={comp.desc}
                            onChange={(e) => {
                              const updated = [...formData.components];
                              updated[idx].desc = e.target.value;
                              setFormData({ ...formData, components: updated });
                            }}
                            className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg p-2.5 text-white text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteComponentRow(idx)}
                          className="p-1.5 text-red-400 hover:text-red-300 mt-1"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CFD ANALYSES */}
              {activeTab === 'cfd' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Aerodynamic & CFD Flight Analyses
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Upload aerodynamic simulation charts, pressure distribution renders, and hover mode metrics.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addAnalysisRow}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#D04741] px-3 py-1.5 rounded-lg hover:opacity-90"
                    >
                      <Plus size={14} /> Add Analysis Image
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.analyses?.map((an, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#141414] border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-gray-400">Analysis Render #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => deleteAnalysisRow(idx)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <ImageUploader
                          label="Analysis Image / CFD Render"
                          value={an.src}
                          onChange={(url) => {
                            const updated = [...formData.analyses];
                            updated[idx].src = url;
                            setFormData({ ...formData, analyses: updated });
                          }}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Caption (e.g. VTOL Hover Mode Pressure Distribution)"
                            value={an.caption}
                            onChange={(e) => {
                              const updated = [...formData.analyses];
                              updated[idx].caption = e.target.value;
                              setFormData({ ...formData, analyses: updated });
                            }}
                            className="bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Alt tag"
                            value={an.alt}
                            onChange={(e) => {
                              const updated = [...formData.analyses];
                              updated[idx].alt = e.target.value;
                              setFormData({ ...formData, analyses: updated });
                            }}
                            className="bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: DYNAMIC CUSTOM SECTIONS (Add / Delete custom sections) */}
              {activeTab === 'custom' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-[#1f1616] border border-[#D04741]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Layers size={14} className="text-[#EF5F5A]" />
                        Dynamic Custom Section Builder
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Add custom technical sections to this project (e.g. Specs tables, custom component lists, or text overviews).
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => addCustomSection('specs')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
                      >
                        <Plus size={13} className="text-[#EF5F5A]" />
                        <span>Add Specs Table</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addCustomSection('components')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
                      >
                        <Plus size={13} className="text-[#EF5F5A]" />
                        <span>Add Component List</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addCustomSection('text')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
                      >
                        <Plus size={13} className="text-[#EF5F5A]" />
                        <span>Add Text Block</span>
                      </button>
                    </div>
                  </div>

                  {formData.customSections && formData.customSections.length > 0 ? (
                    <div className="space-y-6">
                      {formData.customSections.map((sec, secIdx) => (
                        <div key={sec.id || secIdx} className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
                          <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
                            <div className="flex-1 max-w-md">
                              <span className="text-[10px] font-mono uppercase text-[#EF5F5A] font-bold block mb-1">
                                Section #{secIdx + 1} ({sec.type.toUpperCase()})
                              </span>
                              <input
                                type="text"
                                placeholder="Section Title (e.g. Ground Control Telemetry)"
                                value={sec.title}
                                onChange={(e) => {
                                  const updated = [...formData.customSections!];
                                  updated[secIdx].title = e.target.value;
                                  setFormData({ ...formData, customSections: updated });
                                }}
                                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs font-bold"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteCustomSection(secIdx)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20"
                            >
                              <Trash2 size={13} /> Delete Section
                            </button>
                          </div>

                          {/* Render Section Rows by Type */}
                          {sec.type === 'specs' && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[11px] font-mono text-gray-400">Spec Values (Key - Value)</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...formData.customSections!];
                                    updated[secIdx].specs = [
                                      ...(updated[secIdx].specs || []),
                                      { id: `sp-${Date.now()}`, label: 'Metric', value: 'Value' },
                                    ];
                                    setFormData({ ...formData, customSections: updated });
                                  }}
                                  className="text-[11px] font-bold text-[#EF5F5A] hover:underline inline-flex items-center gap-1"
                                >
                                  <Plus size={12} /> Add Metric Row
                                </button>
                              </div>

                              {sec.specs?.map((sp, spIdx) => (
                                <div key={spIdx} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Metric label"
                                    value={sp.label}
                                    onChange={(e) => {
                                      const updated = [...formData.customSections!];
                                      updated[secIdx].specs![spIdx].label = e.target.value;
                                      setFormData({ ...formData, customSections: updated });
                                    }}
                                    className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Value"
                                    value={sp.value}
                                    onChange={(e) => {
                                      const updated = [...formData.customSections!];
                                      updated[secIdx].specs![spIdx].value = e.target.value;
                                      setFormData({ ...formData, customSections: updated });
                                    }}
                                    className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs font-mono"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...formData.customSections!];
                                      updated[secIdx].specs = updated[secIdx].specs!.filter((_, i) => i !== spIdx);
                                      setFormData({ ...formData, customSections: updated });
                                    }}
                                    className="p-1.5 text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {sec.type === 'components' && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[11px] font-mono text-gray-400">Component List (Part - Description)</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...formData.customSections!];
                                    updated[secIdx].components = [
                                      ...(updated[secIdx].components || []),
                                      { name: 'Component Name', desc: 'Description' },
                                    ];
                                    setFormData({ ...formData, customSections: updated });
                                  }}
                                  className="text-[11px] font-bold text-[#EF5F5A] hover:underline inline-flex items-center gap-1"
                                >
                                  <Plus size={12} /> Add Component Part
                                </button>
                              </div>

                              {sec.components?.map((cp, cpIdx) => (
                                <div key={cpIdx} className="p-2.5 rounded-lg bg-black/20 border border-white/5 space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      placeholder="Component / Part Name"
                                      value={cp.name}
                                      onChange={(e) => {
                                        const updated = [...formData.customSections!];
                                        updated[secIdx].components![cpIdx].name = e.target.value;
                                        setFormData({ ...formData, customSections: updated });
                                      }}
                                      className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs font-bold"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...formData.customSections!];
                                        updated[secIdx].components = updated[secIdx].components!.filter((_, i) => i !== cpIdx);
                                        setFormData({ ...formData, customSections: updated });
                                      }}
                                      className="p-1.5 text-red-400 hover:text-red-300"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                  <textarea
                                    rows={1}
                                    placeholder="Function / description..."
                                    value={cp.desc}
                                    onChange={(e) => {
                                      const updated = [...formData.customSections!];
                                      updated[secIdx].components![cpIdx].desc = e.target.value;
                                      setFormData({ ...formData, customSections: updated });
                                    }}
                                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg p-2 text-white text-xs"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {sec.type === 'text' && (
                            <div>
                              <textarea
                                rows={3}
                                placeholder="Write documentation or analysis notes for this section..."
                                value={sec.content || ''}
                                onChange={(e) => {
                                  const updated = [...formData.customSections!];
                                  updated[secIdx].content = e.target.value;
                                  setFormData({ ...formData, customSections: updated });
                                }}
                                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg p-3 text-white text-xs leading-relaxed"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl">
                      <p className="text-xs text-gray-400">
                        No custom sections added yet. Click one of the buttons above to add custom spec tables, component lists, or text blocks.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D04741] to-[#EF5F5A] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#D04741]/20 disabled:opacity-50 transition-all"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>Save Project & Specs Live</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProgressProjectsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-gray-400 font-mono">Loading progress manager...</div>}>
      <AdminProgressProjectsContent />
    </React.Suspense>
  );
}
