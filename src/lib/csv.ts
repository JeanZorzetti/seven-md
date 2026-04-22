export function toCSV(rows: Record<string, unknown>[], headers: { key: string; label: string }[]): string {
  const escape = (val: unknown) => {
    const s = val === null || val === undefined ? '' : String(val)
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
  }
  const headerRow = headers.map((h) => escape(h.label)).join(',')
  const dataRows = rows.map((row) => headers.map((h) => escape(row[h.key])).join(','))
  return [headerRow, ...dataRows].join('\n')
}
