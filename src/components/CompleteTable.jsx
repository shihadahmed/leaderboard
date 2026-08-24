import { useState, Fragment } from 'react'
import { fmtDate, fmtDateTime } from '../lib'
import { ColorDots } from './Bits'

function RowDetail({ task }) {
  return (
    <tr className="border-t border-slate-200 bg-slate-50">
      <td colSpan={7} className="p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1 text-sm text-slate-700">
            <div><span className="text-slate-500">ওয়ার্ক অর্ডার:</span> {task.workOrderNo}</div>
            <div><span className="text-slate-500">PO:</span> {task.poNumber || '—'}</div>
            <div><span className="text-slate-500">কাস্টমার:</span> {task.customerName}</div>
            <div><span className="text-slate-500">তৈরিকারক:</span> {task.creatorName}</div>
            <div><span className="text-slate-500">পরিমাণ:</span> {task.productCount}</div>
            <div><span className="text-slate-500">ডেলিভারি তারিখ:</span> {fmtDate(task.deliveryDate)}</div>
            <div><span className="text-slate-500">সম্পন্ন:</span> {fmtDateTime(task.completedAt)}</div>
            <div className="flex flex-wrap gap-3">
              {task.badhai && <span>বাঁধাই: {task.badhai}</span>}
              {task.daiCutting && <span>কাটিং: {task.daiCutting}</span>}
              {task.packingAndDelivery && <span>প্যাক: {task.packingAndDelivery}</span>}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-slate-900">আইটেম সমূহ</div>
            {task.items?.length ? (
              task.items.map((it, i) => (
                <div key={i} className="rounded border border-slate-200 bg-white p-2 text-xs text-slate-700">
                  <div className="font-medium text-slate-900">
                    #{it.slNo} {it.paper?.paperName} ({it.paper?.gsm} GSM, {it.paper?.count})
                  </div>
                  <div className="text-slate-500">
                    কাটিং: {it.cutting?.cuttingSize} | ছাপা: {it.setting?.printType} | {it.setting?.onnonno}
                  </div>
                  <ColorDots colors={it.colors} />
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400">কোন আইটেম নেই</div>
            )}
          </div>
        </div>

        {task.history?.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-sm font-semibold text-slate-900">ওয়ার্কফ্লো ইতিহাস</div>
            <div className="space-y-1.5">
              {task.history.map((h, i) => (
                <div key={i} className="rounded bg-white px-2 py-1.5 text-sm ring-1 ring-slate-200">
                  <div className="text-[11px] font-semibold text-blue-700">
                    {h.stage} • {h.by} • {new Date(h.at).toLocaleString('bn-BD')}
                  </div>
                  <div className="text-slate-700">{h.text}</div>
              {h.quantity != null && (
                <div className="mt-0.5 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-700">
                  পরিমাণ: {h.quantity} {h.unit}
                </div>
              )}
                </div>
              ))}
            </div>
          </div>
        )}
      </td>
    </tr>
  )
}

export default function CompleteTable({ tasks }) {
  const [openId, setOpenId] = useState(null)

  if (!tasks.length) {
    return <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-400">এখনও কোন কাজ কম্প্লিট হয়নি।</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="px-3 py-2 font-semibold">অর্ডার নং</th>
            <th className="px-3 py-2 font-semibold">প্রোডাক্ট</th>
            <th className="px-3 py-2 font-semibold">কাস্টমার</th>
            <th className="px-3 py-2 font-semibold">পরিমাণ</th>
            <th className="px-3 py-2 font-semibold">ডেলিভারি</th>
            <th className="px-3 py-2 font-semibold">সম্পন্ন</th>
            <th className="px-3 py-2 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <Fragment key={t.id}>
              <tr
                onClick={() => setOpenId(openId === t.id ? null : t.id)}
                className="cursor-pointer border-t border-slate-200 hover:bg-slate-50"
              >
                <td className="px-3 py-2 font-semibold text-slate-900">{t.workOrderNo}</td>
                <td className="px-3 py-2 text-slate-800">{t.productName}</td>
                <td className="px-3 py-2 text-slate-600">{t.customerName}</td>
                <td className="px-3 py-2 text-slate-600">{t.productCount}</td>
                <td className="px-3 py-2 text-slate-600">{fmtDate(t.deliveryDate)}</td>
                <td className="px-3 py-2 font-medium text-emerald-700">{fmtDate(t.completedAt)}</td>
                <td className="px-3 py-2 text-blue-700">{openId === t.id ? '▲ বন্ধ' : '▼ ডিটেইল'}</td>
              </tr>
              {openId === t.id && <RowDetail task={t} />}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
