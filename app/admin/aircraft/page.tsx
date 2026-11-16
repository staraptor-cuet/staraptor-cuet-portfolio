'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plane,
  Save,
  Plus,
  Trash2,
  Check,
  Loader2,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';
import { AircraftSpecs, SpecItem, AvionicsItem, ComponentItem } from '@/lib/types';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminAircraftPage() {
  const [specs, setSpecs] = useState<AircraftSpecs | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.aircraft) setSpecs(data.aircraft);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!specs) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'aircraft', data: specs }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving aircraft specifications');
    } finally {
      setSaving(false);
    }
  };

  // Spec helpers
  const handlePhysicalChange = (index: number, field: 'label' | 'value', val: string) => {
    if (!specs) return;
    const updated = [...specs.physicalData];
    updated[index] = { ...updated[index], [field]: val };
    setSpecs({ ...specs, physicalData: updated });
  };

  const addPhysicalRow = () => {
    if (!specs) return;
    setSpecs({
      ...specs,
      physicalData: [...specs.physicalData, { id: `pd-${Date.now()}`, label: 'New Metric', value: '0' }],
    });
  };

  const deletePhysicalRow = (index: number) => {
    if (!specs) return;
    setSpecs({
      ...specs,
      physicalData: specs.physicalData.filter((_, i) => i !== index),
    });
  };

  const handlePerformanceChange = (index: number, field: 'label' | 'value', val: string) => {
    if (!specs) return;
    const updated = [...specs.performanceData];
    updated[index] = { ...updated[index], [field]: val };
    setSpecs({ ...specs, performanceData: updated });
  };

  const addPerformanceRow = () => {
    if (!specs) return;
    setSpecs({
      ...specs,
      performanceData: [...specs.performanceData, { id: `perf-${Date.now()}`, label: 'New Metric', value: '0' }],
    });
  };

  const deletePerformanceRow = (index: number) => {
    if (!specs) return;
    setSpecs({
      ...specs,
      performanceData: specs.performanceData.filter((_, i) => i !== index),
    });
  };

  // Component helpers
  const handleComponentChange = (index: number, field: 'name' | 'desc', val: string) => {
    if (!specs) return;
    const updated = [...specs.components];
    updated[index] = { ...updated[index], [field]: val };
    setSpecs({ ...specs, components: updated });
  };

  const addComponentRow = () => {
    if (!specs) return;
    setSpecs({
      ...specs,
      components: [...specs.components, { name: '', desc: '' }],
    });
  };

  const deleteComponentRow = (index: number) => {
    if (!specs) return;
    setSpecs({
      ...specs,
      components: specs.components.filter((_, i) => i !== index),
    });
  };

  if (loading || !specs) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#D04741] mx-auto mb-2" />
        <p className="text-sm text-gray-400">Loading Aircraft Specs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/progress"
            className="inline-flex items-center gap-1.5 text-xs text-[#EF5F5A] hover:text-[#ff7872] font-mono mb-2 transition-colors"
          >
            <span>← Section: Our Progress</span>
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-[#D04741]/10 text-[#EF5F5A]">
              <Plane size={20} />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-montserrat">Aircraft Specifications (VTOL Model 1)</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Configure technical drone metrics, physical dimensions, avionics package, and components for <strong className="text-white">STARAPTOR VTOL - V1</strong>.
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
            className="bg-gradient-to-r from-[#D04741] to-[#EF5F5A] hover:opacity-95 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-[#D04741]/20 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save Model 1 Specs</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: General & Hero Image */}
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Plane size={16} className="text-[#D04741]" />
            Aircraft Identity
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Model Name</label>
            <input
              type="text"
              value={specs.name}
              onChange={(e) => setSpecs({ ...specs, name: e.target.value })}
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Classification</label>
            <input
              type="text"
              value={specs.classification}
              onChange={(e) => setSpecs({ ...specs, classification: e.target.value })}
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#D04741]"
            />
          </div>

          <ImageUploader
            label="Main 3D / Aircraft Render"
            value={specs.heroImage}
            onChange={(url) => setSpecs({ ...specs, heroImage: url })}
            recommendedSize="Transparent PNG or high-res render"
          />
        </div>

        {/* Middle: Physical & Performance */}
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 space-y-6">
          {/* Physical Data */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Layers size={14} className="text-[#ff7973]" /> Physical Data
              </h3>
              <button
                type="button"
                onClick={addPhysicalRow}
                className="text-[11px] text-[#ff7973] hover:underline flex items-center gap-1 font-bold"
              >
                <Plus size={12} /> Add Metric
              </button>
            </div>

            <div className="space-y-2">
              {specs.physicalData.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => handlePhysicalChange(idx, 'label', e.target.value)}
                    placeholder="Metric"
                    className="flex-1 bg-[#121212] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => handlePhysicalChange(idx, 'value', e.target.value)}
                    placeholder="Value"
                    className="w-24 bg-[#121212] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white text-right font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => deletePhysicalRow(idx)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Data */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Activity size={14} className="text-emerald-400" /> Performance Data
              </h3>
              <button
                type="button"
                onClick={addPerformanceRow}
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <Plus size={12} /> Add Metric
              </button>
            </div>

            <div className="space-y-2">
              {specs.performanceData.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => handlePerformanceChange(idx, 'label', e.target.value)}
                    placeholder="Metric"
                    className="flex-1 bg-[#121212] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => handlePerformanceChange(idx, 'value', e.target.value)}
                    placeholder="Value"
                    className="w-24 bg-[#121212] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white text-right font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => deletePerformanceRow(idx)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Avionics Package */}
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu size={16} className="text-blue-400" />
            Avionics & Materials
          </h2>

          <div className="space-y-3">
            {specs.avionics.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#121212] rounded-lg border border-white/5 space-y-1.5">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...specs.avionics];
                    updated[idx] = { ...updated[idx], title: e.target.value };
                    setSpecs({ ...specs, avionics: updated });
                  }}
                  className="w-full bg-transparent font-bold text-xs text-[#D04741] focus:outline-none"
                />
                <textarea
                  rows={2}
                  value={item.desc}
                  onChange={(e) => {
                    const updated = [...specs.avionics];
                    updated[idx] = { ...updated[idx], desc: e.target.value };
                    setSpecs({ ...specs, avionics: updated });
                  }}
                  className="w-full bg-transparent text-xs text-gray-300 focus:outline-none resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bill of Materials / Components Table */}
      <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Component & Hardware Inventory
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Items featured on the aircraft architecture page
            </p>
          </div>
          <button
            type="button"
            onClick={addComponentRow}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {specs.components.map((comp, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-[#121212] p-2.5 rounded-lg border border-white/5">
              <input
                type="text"
                value={comp.name}
                onChange={(e) => handleComponentChange(idx, 'name', e.target.value)}
                placeholder="Item name (e.g. Flight Controller)"
                className="w-1/3 bg-[#181818] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-bold"
              />
              <input
                type="text"
                value={comp.desc}
                onChange={(e) => handleComponentChange(idx, 'desc', e.target.value)}
                placeholder="Description of role and functionality..."
                className="flex-1 bg-[#181818] border border-white/10 rounded px-2.5 py-1.5 text-xs text-gray-300"
              />
              <button
                type="button"
                onClick={() => deleteComponentRow(idx)}
                className="text-red-400 hover:text-red-300 p-1.5"
                title="Remove component"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

