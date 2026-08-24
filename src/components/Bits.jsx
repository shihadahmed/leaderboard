import { COLOR_LABELS } from '../lib'

export function ColorDots({ colors }) {
  if (!colors) return null
  const active = Object.keys(COLOR_LABELS).filter((k) => colors[k])
  if (!active.length) return null
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {active.map((k) => (
        <span key={k} className="inline-flex items-center gap-1" title={COLOR_LABELS[k].label}>
          <span className={`h-3 w-3 rounded-full ring-1 ring-white/20 ${COLOR_LABELS[k].dot}`} />
          <span className="text-[11px] text-slate-400">{COLOR_LABELS[k].label}</span>
        </span>
      ))}
      {colors.extra?.map((ex, i) => (
        <span key={i} className="rounded bg-fuchsia-900/60 px-1.5 py-0.5 text-[11px] text-fuchsia-200">
          {ex}
        </span>
      ))}
    </span>
  )
}
