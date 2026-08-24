import { useState, useEffect, useMemo } from 'react'
import rawData from './assets/data.json'
import { initTask } from './lib'
import Header from './components/Header'
import Stats from './components/Stats'
import TaskCard from './components/TaskCard'
import CompleteTable from './components/CompleteTable'
import AddWorkOrder from './components/AddWorkOrder'
import Login from './components/Login'

const STORAGE_KEY = 'print-leaderboard-v1'
const USER_KEY = 'print-leaderboard-user'

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch (e) {
    console.warn('Failed to read saved state', e)
  }
  return rawData.map(initTask)
}

function loadUser() {
  try {
    const saved = localStorage.getItem(USER_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn('Failed to read user', e)
  }
  return null
}

export default function App() {
  const [tasks, setTasks] = useState(loadState)
  const [user, setUser] = useState(loadUser)
  const [view, setView] = useState('leaderboard')
  const [showAdd, setShowAdd] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (e) {
      console.warn('Failed to save state', e)
    }
  }, [tasks])

  useEffect(() => {
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
      else localStorage.removeItem(USER_KEY)
    } catch (e) {
      console.warn('Failed to save user', e)
    }
  }, [user])

  const leaderboard = useMemo(() => tasks.filter((t) => !t.completed && t.isLeaderBoard !== false), [tasks])
  const completed = useMemo(() => tasks.filter((t) => t.completed), [tasks])
  const urgentTasks = useMemo(() => leaderboard.filter((t) => t.urgent), [leaderboard])
  const regularTasks = useMemo(() => leaderboard.filter((t) => !t.urgent), [leaderboard])

  function handleUpdate(id, update) {
    setTasks((ts) =>
      ts.map((t) =>
        t.id === id
          ? { ...t, history: [...(t.history || []), { stage: t.stage, ...update, at: new Date().toISOString() }] }
          : t
      )
    )
  }

  function handleAdvance(id, { stage, by, text, quantity, unit }) {
    setTasks((ts) =>
      ts.map((t) =>
        t.id === id
          ? {
              ...t,
              stage,
              history: [...(t.history || []), { stage, by, text, quantity, unit, at: new Date().toISOString() }],
            }
          : t
      )
    )
  }

  function handleComplete(id) {
    setTasks((ts) =>
      ts.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: true,
              completedAt: new Date().toISOString(),
              stage: 'কম্প্লিট',
              history: [...(t.history || []), { stage: 'কম্প্লিট', by: 'সিস্টেম', text: 'ডেলিভারি সম্পন্ন', at: new Date().toISOString() }],
            }
          : t
      )
    )
  }

  function handleAdd(data) {
    setTasks((ts) => [
      ...ts,
      {
        ...data,
        id: data.workOrderNo + '-' + Date.now(),
        items: [],
        stage: 'নতুন',
        history: [],
        completed: false,
        completedAt: null,
        isLeaderBoard: true,
      },
    ])
  }

  function handleReset() {
    if (!window.confirm('সব ডাটা রিসেট করে মূল লিস্টে ফিরে যাবে। আপনি কি নিশ্চিত?')) return
    localStorage.removeItem(STORAGE_KEY)
    setTasks(rawData.map(initTask))
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header
        user={user}
        onLogin={() => setShowLogin(true)}
        onLogout={() => setUser(null)}
        onAdd={() => setShowAdd(true)}
        onReset={handleReset}
      />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Stats leaderboard={leaderboard} completed={completed.length} />

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setView('leaderboard')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              view === 'leaderboard' ? 'bg-red-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-slate-100'
            }`}
          >
            লিডারবোর্ড ({leaderboard.length})
          </button>
          <button
            onClick={() => setView('completed')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              view === 'completed' ? 'bg-red-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-slate-100'
            }`}
          >
            কম্প্লিট লিস্ট ({completed.length})
          </button>
        </div>

        {view === 'leaderboard' && (
          <div className="mt-6 space-y-8">
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-600" />
                <h2 className="text-lg font-bold text-slate-900">জরুরি কাজ</h2>
                <span className="rounded-full bg-red-900 px-2 py-0.5 text-xs font-semibold text-red-200">
                  {urgentTasks.length}
                </span>
              </div>
              {urgentTasks.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {urgentTasks.map((t) => (
                    <TaskCard key={t.id} task={t} user={user} onUpdate={handleUpdate} onAdvance={handleAdvance} onComplete={handleComplete} />
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-400">কোন জরুরি কাজ নেই।</p>
              )}
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">রেগুলার / লোকাল কাজ</h2>
                <span className="rounded-full bg-blue-900 px-2 py-0.5 text-xs font-semibold text-blue-200">
                  {regularTasks.length}
                </span>
              </div>
              {regularTasks.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {regularTasks.map((t) => (
                    <TaskCard key={t.id} task={t} user={user} onUpdate={handleUpdate} onAdvance={handleAdvance} onComplete={handleComplete} />
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-400">কোন রেগুলার কাজ নেই।</p>
              )}
            </section>
          </div>
        )}

        {view === 'completed' && (
          <div className="mt-6">
            <CompleteTable tasks={completed} />
          </div>
        )}
      </main>

      {showAdd && <AddWorkOrder onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
      {showLogin && <Login onLogin={(u) => setUser(u)} onClose={() => setShowLogin(false)} />}
    </div>
  )
}
