export default function Header({ user, onLogin, onLogout, onAdd, onReset }) {
  return (
    <header className="border-b-4 border-red-700 bg-blue-900 px-4 py-6 text-white shadow">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-red-400">প্রিন্ট</span> লিডারবোর্ড
          </h1>
          <p className="text-sm text-blue-200">আইটেম থেকে ডেলিভারি — ওয়ার্ক অর্ডার ট্র্যাকিং</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
              <div className="text-right leading-tight">
                <div className="text-sm font-semibold text-white">{user.name}</div>
                <div className="text-[11px] text-blue-200">{user.role}</div>
              </div>
              <button
                onClick={onLogout}
                className="rounded bg-red-700 px-2 py-1 text-xs font-semibold text-white hover:bg-red-600"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-100"
            >
              লগইন
            </button>
          )}
          <button
            onClick={onAdd}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-100"
          >
            + নতুন অর্ডার
          </button>
          <button
            onClick={onReset}
            className="rounded-lg border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            রিসেট
          </button>
        </div>
      </div>
    </header>
  )
}
