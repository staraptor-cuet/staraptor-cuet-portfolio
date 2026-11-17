/**
 * Real-time Admin Live Preview Draft Manager
 * Allows admin to preview modifications on any section before saving/confirming.
 */

const STORAGE_KEY = 'staraptor_preview_draft';

export function getPreviewDraft(): Record<string, any> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setPreviewDraft(section: string, data: any): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getPreviewDraft() || {};
    const updated = {
      ...current,
      [section]: data,
      _timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Broadcast to open iframes and other tabs
    window.postMessage(
      {
        type: 'STARAPTOR_PREVIEW_UPDATE',
        draft: updated,
      },
      '*'
    );
  } catch (e) {
    console.warn('Failed to update preview draft:', e);
  }
}

export function clearPreviewDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.postMessage(
      {
        type: 'STARAPTOR_PREVIEW_CLEAR',
      },
      '*'
    );
  } catch (e) {
    console.warn('Failed to clear preview draft:', e);
  }
}

