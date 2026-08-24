export const STAGE_ORDER = ['নতুন', 'প্রিন্টিং', 'ফিনিশিং', 'ডেলিভারি']

export function nextStage(stage) {
  const i = STAGE_ORDER.indexOf(stage)
  if (i < 0 || i >= STAGE_ORDER.length - 1) return null
  return STAGE_ORDER[i + 1]
}

export const STAGE_BADGE = {
  নতুন: 'bg-slate-700 text-slate-200',
  প্রিন্টিং: 'bg-blue-900 text-blue-200',
  ফিনিশিং: 'bg-violet-900 text-violet-200',
  ডেলিভারি: 'bg-red-900 text-red-200',
  কম্প্লিট: 'bg-emerald-900 text-emerald-200',
}

export const STAGE_ACCENT = {
  নতুন: 'bg-slate-400',
  প্রিন্টিং: 'bg-blue-500',
  ফিনিশিং: 'bg-violet-500',
  ডেলিভারি: 'bg-red-500',
  কম্প্লিট: 'bg-emerald-500',
}

export const STAGE_SOFT = {
  নতুন: 'bg-slate-100 text-slate-600',
  প্রিন্টিং: 'bg-blue-50 text-blue-700',
  ফিনিশিং: 'bg-violet-50 text-violet-700',
  ডেলিভারি: 'bg-red-50 text-red-700',
  কম্প্লিট: 'bg-emerald-50 text-emerald-700',
}

export const STAGE_BORDER = {
  নতুন: 'border-l-slate-400',
  প্রিন্টিং: 'border-l-blue-500',
  ফিনিশিং: 'border-l-violet-500',
  ডেলিভারি: 'border-l-red-500',
  কম্প্লিট: 'border-l-emerald-500',
}

export const STAGE_RING = {
  নতুন: 'ring-slate-300',
  প্রিন্টিং: 'ring-blue-200',
  ফিনিশিং: 'ring-violet-200',
  ডেলিভারি: 'ring-red-200',
  কম্প্লিট: 'ring-emerald-200',
}

export const COLOR_LABELS = {
  cyan: { label: 'সায়ান', dot: 'bg-cyan-400' },
  maroon: { label: 'মেরুন', dot: 'bg-red-700' },
  yellow: { label: 'হলুদ', dot: 'bg-yellow-400' },
  black: { label: 'কালো', dot: 'bg-neutral-300' },
}

export function fmtDate(d) {
  if (!d) return '—'
  const date = typeof d === 'string' ? new Date(d) : new Date(d.$date || d)
  if (isNaN(date)) return '—'
  return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function fmtDateTime(d) {
  if (!d) return '—'
  const date = new Date(d)
  if (isNaN(date)) return '—'
  return date.toLocaleString('bn-BD')
}

export function isOverdue(d) {
  if (!d) return false
  const date = typeof d === 'string' ? new Date(d) : new Date(d.$date || d)
  if (isNaN(date)) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export function normalize(d) {
  return {
    id: d._id?.$oid || d.workOrderNo,
    workOrderNo: d.workOrderNo || '',
    poNumber: d.poNumber || '',
    productName: d.productName || '',
    productCount: d.productCount || '',
    deliveryDate: d.deliveryDate,
    creatorName: d.creatorName || '',
    customerName: d.customerName || '',
    items: d.items || [],
    badhai: d.badhai || '',
    daiCutting: d.daiCutting || '',
    packingAndDelivery: d.packingAndDelivery || '',
    localCustomer: !!d.localCustomer,
    urgent: !!d.urgent,
    isLeaderBoard: d.isLeaderBoard !== false,
  }
}

export function initTask(d) {
  return {
    ...normalize(d),
    stage: 'নতুন',
    history: [],
    completed: false,
    completedAt: null,
  }
}
