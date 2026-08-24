import { Fragment, useState } from 'react'
import { STAGE_ORDER, nextStage, STAGE_BADGE, STAGE_ACCENT, STAGE_SOFT, STAGE_BORDER, STAGE_RING, fmtDate, isOverdue } from '../lib'
import { ColorDots } from './Bits'

function buildUnits(task) {
  let units = []
  if (task?.daiCutting) units = [...units, 'pcs', 'set', 'pair']
  if (task?.badhai) units = [...units, 'book']
  if (!units.length) units = ['pcs', 'set', 'pair', 'book']
  return units
}

function needsQty(stage) {
  return stage === 'ফিনিশিং' || stage === 'ডেলিভারি'
}

function UpdateForm({ task, user, showQty = false, onSubmit, onCancel, title = 'আপডেট যোগ করুন' }) {
  const [by, setBy] = useState('')
  const [text, setText] = useState('')
  const [qty, setQty] = useState('')
  const [unit, setUnit] = useState(() => buildUnits(task)[0])
  const units = buildUnits(task)

  function handle(e) {
    e.preventDefault()
    if (!text.trim()) return
    if (showQty && (!qty || Number(qty) <= 0)) return
    const payload = {
      by: user ? user.name : by.trim() || 'অজানা',
      text: text.trim(),
    }
    if (showQty) {
      payload.quantity = Number(qty)
      payload.unit = unit
    }
    onSubmit(payload)
    setBy('')
    setText('')
    setQty('')
  }

  return (
    <form onSubmit={handle} className="mt-3 space-y-2 rounded-lg border border-slate-300 bg-slate-50 p-3">
      {user ? (
        <div className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">
          ইনপুট নিচ্ছেন: <span className="font-semibold">{user.name}</span> ({user.role})
        </div>
      ) : (
        <input
          className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 placeholder:text-slate-400"
          placeholder="আপনার নাম (ঐচ্ছিক)"
          value={by}
          onChange={(e) => setBy(e.target.value)}
        />
      )}

      {showQty && (
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            required
            className="w-28 rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900"
            placeholder="পরিমাণ *"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
          <select
            className="flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      )}

      <textarea
        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 placeholder:text-slate-400"
        rows={2}
        placeholder="এই ধাপে কী করলেন লিখুন..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded px-3 py-1 text-sm text-slate-500 hover:bg-slate-200">
          বাতিল
        </button>
        <button type="submit" className="rounded bg-blue-700 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600">
          {title}
        </button>
      </div>
    </form>
  )
}

function ItemRow({ it }) {
  return (
    <div className="text-xs text-slate-700">
      <div className="font-medium text-slate-900">
        #{it.slNo} {it.paper?.paperName} ({it.paper?.gsm} GSM)
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500">
        <span>কাটিং: {it.cutting?.cuttingSize}</span>
        <span>ছাপা: {it.setting?.printType}</span>
        <ColorDots colors={it.colors} />
      </div>
    </div>
  )
}

function Meta({ label, children, danger }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <span className={`text-sm font-medium ${danger ? 'text-red-600' : 'text-slate-700'}`}>{children}</span>
    </div>
  )
}

function RegularCard({ task, user, onUpdate, onAdvance, onComplete }) {
  const [openAdvance, setOpenAdvance] = useState(false)
  const nxt = nextStage(task.stage)
  const overdue = isOverdue(task.deliveryDate) && !task.completed

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-extrabold text-slate-900">{task.workOrderNo}</span>
            {task.localCustomer && (
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">লোকাল</span>
            )}
            {!task.localCustomer && (
              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">রেগুলার</span>
            )}
          </div>
          <h3 className="mt-2 text-lg font-bold text-slate-900">{task.productName}</h3>
          <p className="text-sm text-slate-500">{task.customerName}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${STAGE_BADGE[task.stage] || 'bg-slate-200 text-slate-700'}`}>
          {task.stage}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="text-slate-700"><span className="text-slate-400">পরিমাণ:</span> {task.productCount}</div>
        <div className="text-slate-700"><span className="text-slate-400">তৈরিকারক:</span> {task.creatorName}</div>
        <div className={overdue ? 'font-medium text-red-700' : 'text-slate-700'}>
          <span className="text-slate-400">ডেলিভারি:</span> {fmtDate(task.deliveryDate)}
          {overdue && ' ⚠'}
        </div>
        <div className="text-slate-700"><span className="text-slate-400">PO:</span> {task.poNumber || '—'}</div>
      </div>

      {task.items?.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          {task.items.map((it, i) => (
            <ItemRow key={i} it={it} />
          ))}
        </div>
      )}

      {(task.badhai || task.daiCutting || task.packingAndDelivery) && (
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
          {task.badhai && <span className="rounded bg-teal-50 px-1.5 py-0.5 text-teal-700">বাঁধাই: {task.badhai}</span>}
          {task.daiCutting && <span className="rounded bg-orange-50 px-1.5 py-0.5 text-orange-700">কাটিং: {task.daiCutting}</span>}
          {task.packingAndDelivery && (
            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-indigo-700">প্যাক: {task.packingAndDelivery}</span>
          )}
        </div>
      )}

      {task.history?.length > 0 && (
        <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
          {task.history.map((h, i) => (
            <div key={i} className="rounded bg-slate-50 px-2 py-1.5 text-sm">
              <div className="text-[11px] font-semibold text-blue-700">
                {h.stage} • {h.by} • {new Date(h.at).toLocaleString('bn-BD')}
              </div>
              <div className="text-slate-700">{h.text}</div>
              {h.quantity != null && (
                <div className="mt-0.5 inline-block rounded bg-slate-200 px-1.5 py-0.5 text-[11px] font-medium text-slate-700">
                  পরিমাণ: {h.quantity} {h.unit}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        {nxt ? (
          <button
            onClick={() => setOpenAdvance((v) => !v)}
            className="rounded-lg bg-sky-100 px-3 py-1.5 text-sm font-semibold text-sky-700 hover:bg-sky-200"
          >
            পরবর্তী ধাপ: {nxt}
          </button>
        ) : (
          <button
            onClick={() => onComplete(task.id)}
            className="ml-auto rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            ডেলিভারি কম্প্লিট করুন
          </button>
        )}

        {openAdvance && nxt && (
          <UpdateForm
            task={task}
            user={user}
            showQty={needsQty(nxt)}
            title={`${nxt} ধাপে পাঠান`}
            onSubmit={({ by, text, quantity, unit }) => {
              onAdvance(task.id, { stage: nxt, by, text, quantity, unit })
              setOpenAdvance(false)
            }}
            onCancel={() => setOpenAdvance(false)}
          />
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {STAGE_ORDER.map((s) => (
          <span
            key={s}
            className={`rounded px-1.5 py-0.5 text-[10px] ${
              s === task.stage ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

function UrgentCard({ task, user, onUpdate, onAdvance, onComplete }) {
  const [openAdvance, setOpenAdvance] = useState(false)
  const nxt = nextStage(task.stage)
  const overdue = isOverdue(task.deliveryDate) && !task.completed
  const stageIdx = task.completed ? STAGE_ORDER.length : STAGE_ORDER.indexOf(task.stage)

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white urgent-pulse">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-tight text-slate-900">{task.workOrderNo}</span>
              {task.urgent && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">জরুরি</span>
              )}
              {task.localCustomer && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">লোকাল</span>
              )}
            </div>
            <h3 className="mt-1.5 truncate text-lg font-bold text-slate-900">{task.productName}</h3>
            <p className="truncate text-sm text-slate-500">{task.customerName}</p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STAGE_BADGE[task.stage] || 'bg-slate-200 text-slate-700'}`}>
            {task.stage}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-50/80 p-3">
          <Meta label="পরিমাণ">{task.productCount}</Meta>
          <Meta label="তৈরিকারক">{task.creatorName}</Meta>
          <Meta label="ডেলিভারি" danger={overdue}>
            {fmtDate(task.deliveryDate)}
            {overdue && <span className="ml-1 text-[10px] font-semibold">• লেট</span>}
          </Meta>
          <Meta label="PO">{task.poNumber || '—'}</Meta>
        </div>

        {task.items?.length > 0 && (
          <div className="mt-4 space-y-2">
            {task.items.map((it, i) => (
              <ItemRow key={i} it={it} />
            ))}
          </div>
        )}

        {(task.badhai || task.daiCutting || task.packingAndDelivery) && (
          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
            {task.badhai && <span className="rounded-md bg-teal-50 px-2 py-0.5 font-medium text-teal-700">বাঁধাই: {task.badhai}</span>}
            {task.daiCutting && <span className="rounded-md bg-orange-50 px-2 py-0.5 font-medium text-orange-700">কাটিং: {task.daiCutting}</span>}
            {task.packingAndDelivery && (
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">প্যাক: {task.packingAndDelivery}</span>
            )}
          </div>
        )}

        <div className="mt-5">
          <div className="flex items-center">
            {STAGE_ORDER.map((s, i) => {
              const done = i < stageIdx
              const current = i === stageIdx
              return (
                <Fragment key={s}>
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        current
                          ? `${STAGE_ACCENT[s] || 'bg-slate-400'} ring-4 ${STAGE_RING[s] || 'ring-slate-200'}`
                          : done
                            ? `${STAGE_ACCENT[s] || 'bg-slate-400'}`
                            : 'bg-slate-200'
                      }`}
                    />
                    <span className={`whitespace-nowrap text-[9px] ${current ? 'font-semibold text-slate-700' : done ? 'text-slate-400' : 'text-slate-300'}`}>
                      {s}
                    </span>
                  </div>
                  {i < STAGE_ORDER.length - 1 && (
                    <span className={`mx-1 h-px flex-1 ${done ? 'bg-slate-300' : 'bg-slate-100'}`} />
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>

      {task.history?.length > 0 && (
        <div className="rounded-b-2xl border-t border-slate-100 bg-slate-50/40 px-5 py-4">
          <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">আপডেট হিস্ট্রি</h4>
          <ol className="relative space-y-3 border-l border-slate-200 pl-4">
            {task.history.map((h, i) => (
              <li key={i} className="relative">
                <span className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-2 ring-white ${STAGE_ACCENT[h.stage] || 'bg-blue-500'}`} />
                <div className="text-[11px] font-medium text-slate-500">
                  {h.stage} • {h.by} • {new Date(h.at).toLocaleString('bn-BD')}
                </div>
                <div className="text-sm text-slate-700">{h.text}</div>
                {h.quantity != null && (
                  <span className="mt-1 inline-block rounded-md bg-slate-200/70 px-1.5 py-0.5 text-[11px] font-medium text-slate-700">
                    পরিমাণ: {h.quantity} {h.unit}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-auto border-t border-slate-100 p-4">
        {nxt ? (
          <button
            onClick={() => setOpenAdvance((v) => !v)}
            className="w-full rounded-xl bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-200"
          >
            পরবর্তী ধাপ: {nxt}
          </button>
        ) : (
          <button
            onClick={() => onComplete(task.id)}
            className="w-full rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
          >
            ডেলিভারি কম্প্লিট করুন
          </button>
        )}

        {openAdvance && nxt && (
          <UpdateForm
            task={task}
            user={user}
            showQty={needsQty(nxt)}
            title={`${nxt} ধাপে পাঠান`}
            onSubmit={({ by, text, quantity, unit }) => {
              onAdvance(task.id, { stage: nxt, by, text, quantity, unit })
              setOpenAdvance(false)
            }}
            onCancel={() => setOpenAdvance(false)}
          />
        )}
      </div>
    </div>
  )
}

export default function TaskCard(props) {
  if (props.task.urgent) return <UrgentCard {...props} />
  return <RegularCard {...props} />
}
