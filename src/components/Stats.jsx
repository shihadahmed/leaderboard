export default function Stats({ leaderboard, completed }) {
  const urgent = leaderboard.filter((t) => t.urgent).length
  const local = leaderboard.filter((t) => t.localCustomer).length
  const cards = [
    { label: 'মোট কাজ', value: leaderboard.length, color: 'text-slate-900' },
    { label: 'জরুরি', value: urgent, color: 'text-red-700' },
    { label: 'লোকাল', value: local, color: 'text-blue-700' },
    { label: 'কম্প্লিট', value: completed, color: 'text-emerald-700' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <div className={`text-3xl font-bold ${c.color}`}>{c.value}</div>
          <div className="mt-1 text-xs text-slate-500">{c.label}</div>
        </div>
      ))}
    </div>
  )
}
