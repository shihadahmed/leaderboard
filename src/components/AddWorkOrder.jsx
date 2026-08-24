import { useState } from 'react'

export default function AddWorkOrder({ onAdd, onClose }) {
  const [form, setForm] = useState({
    workOrderNo: '',
    productName: '',
    productCount: '',
    customerName: '',
    creatorName: '',
    poNumber: '',
    deliveryDate: '',
    urgent: false,
    localCustomer: true,
  })

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function handle(e) {
    e.preventDefault()
    if (!form.workOrderNo.trim() || !form.productName.trim()) return
    onAdd({
      ...form,
      workOrderNo: form.workOrderNo.trim(),
      productName: form.productName.trim(),
      productCount: form.productCount.trim(),
      customerName: form.customerName.trim(),
      creatorName: form.creatorName.trim(),
      poNumber: form.poNumber.trim(),
      deliveryDate: form.deliveryDate ? { $date: new Date(form.deliveryDate).toISOString() } : null,
      urgent: !!form.urgent,
      localCustomer: !!form.localCustomer,
    })
    onClose()
  }

  const label = 'block text-xs font-medium text-slate-600'
  const field = 'mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 placeholder:text-slate-400'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        onSubmit={handle}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
      >
        <h2 className="text-lg font-bold text-slate-900">নতুন ওয়ার্ক অর্ডার যোগ করুন</h2>
        <div>
          <label className={label}>ওয়ার্ক অর্ডার নং *</label>
          <input className={field} value={form.workOrderNo} onChange={(e) => set('workOrderNo', e.target.value)} required />
        </div>
        <div>
          <label className={label}>প্রোডাক্টের নাম *</label>
          <input className={field} value={form.productName} onChange={(e) => set('productName', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>পরিমাণ</label>
            <input className={field} value={form.productCount} onChange={(e) => set('productCount', e.target.value)} />
          </div>
          <div>
            <label className={label}>কাস্টমার</label>
            <input className={field} value={form.customerName} onChange={(e) => set('customerName', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>তৈরিকারক</label>
            <input className={field} value={form.creatorName} onChange={(e) => set('creatorName', e.target.value)} />
          </div>
          <div>
            <label className={label}>PO নং</label>
            <input className={field} value={form.poNumber} onChange={(e) => set('poNumber', e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label}>ডেলিভারি তারিখ</label>
          <input type="date" className={field} value={form.deliveryDate} onChange={(e) => set('deliveryDate', e.target.value)} />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.urgent} onChange={(e) => set('urgent', e.target.checked)} /> জরুরি
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.localCustomer} onChange={(e) => set('localCustomer', e.target.checked)} /> লোকাল কাস্টমার
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-500 hover:bg-slate-100">
            বাতিল
          </button>
          <button type="submit" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600">
            সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </div>
  )
}
