import { useState } from 'react'

const ROLES = ['ছাপাখানা', 'ফিনিশিং', 'ডেলিভারি', 'অ্যাডমিন']

export default function Login({ onLogin, onClose }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState(ROLES[0])

  function handle(e) {
    e.preventDefault()
    if (!name.trim()) return
    onLogin({ name: name.trim(), role })
    onClose()
  }

  const field = 'mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 placeholder:text-slate-400'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        onSubmit={handle}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
      >
        <h2 className="text-lg font-bold text-slate-900">লগইন করুন</h2>
        <div>
          <label className="block text-xs font-medium text-slate-600">আপনার নাম *</label>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="নাম লিখুন" required autoFocus />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">রোল / বিভাগ</label>
          <select className={field} value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-500 hover:bg-slate-100">
            বাতিল
          </button>
          <button type="submit" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600">
            লগইন
          </button>
        </div>
      </form>
    </div>
  )
}
