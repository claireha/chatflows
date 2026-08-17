// Simple shared state for variant statuses using localStorage + custom events
const STORAGE_KEY = 'variant-statuses';

export type VariantStatusMap = Record<string, boolean>;

export function getVariantStatuses(): VariantStatusMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setVariantStatus(name: string, status: boolean) {
  const current = getVariantStatuses();
  current[name] = status;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new CustomEvent('variant-status-change', { detail: { name, status } }));
}

export function getVariantStatus(name: string, defaultStatus: boolean): boolean {
  const statuses = getVariantStatuses();
  return name in statuses ? statuses[name] : defaultStatus;
}
