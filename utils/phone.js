export function normalizePhone(value) {
  const compact = String(value || '').replace(/[\s()-]/g, '');
  if (/^\+91[6-9]\d{9}$/.test(compact)) return compact;
  return null;
}
