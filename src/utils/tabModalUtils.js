/** Collect all unique modal keys from tabs (tab.modalKey + loadButtons[].modalKey) */
export function getModalEntities(tabs) {
  const keys = [
    ...(tabs || []).filter((t) => t.modalKey).map((t) => t.modalKey),
    ...(tabs || []).flatMap((t) => (t.loadButtons || []).filter((b) => b.modalKey).map((b) => b.modalKey)),
  ].filter(Boolean);
  return [...new Set(keys)];
}

/** Resolve queryName for a modal key (for refresh on success) */
export function getQueryForModalKey(tabs, modalKey) {
  const fromTab = (tabs || []).find((t) => t.modalKey === modalKey);
  if (fromTab?.queryName) return fromTab.queryName;
  const fromLoadBtn = (tabs || []).find((t) => (t.loadButtons || []).some((b) => b.modalKey === modalKey));
  return fromLoadBtn?.queryName ?? (modalKey?.startsWith('mdl_') ? null : `${modalKey}s`);
}
