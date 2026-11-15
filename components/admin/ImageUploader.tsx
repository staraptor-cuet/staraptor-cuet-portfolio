'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Check, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  recommendedSize?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Upload Image',
  recommendedSize,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WEBP, SVG)');
      return;
    }
    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            {label}
          </label>
          {recommendedSize && (
            <span className="text-[11px] text-gray-500">{recommendedSize}</span>
          )}
        </div>
      )}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#1e1e1e] p-2 flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-white/5">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized={value.startsWith('data:') || value.startsWith('http')}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-gray-300 truncate">{value}</p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <Check size={12} /> Image active
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            title="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-[#D04741] bg-[#D04741]/10'
              : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/[0.07]'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-2 text-gray-400">
              <Loader2 size={24} className="animate-spin text-[#D04741] mb-2" />
              <span className="text-xs font-semibold">Uploading to storage...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 text-gray-400">
              <Upload size={22} className="mb-2 text-gray-400 group-hover:text-white" />
              <span className="text-xs font-semibold text-gray-300">
                Click to browse or drag & drop image
              </span>
              <span className="text-[11px] text-gray-500 mt-1">
                PNG, JPG, SVG or WEBP
              </span>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
