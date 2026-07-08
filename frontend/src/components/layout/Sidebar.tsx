export const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen backdrop-blur-md border-r border-white/10 bg-white/5 p-6">
      <div className="text-white font-semibold text-lg">
        NeuralHandoff
      </div>

      <nav className="mt-10 space-y-4 text-slate-300">
        <div className="hover:text-white cursor-pointer transition-colors">
          Dashboard
        </div>
        <div className="hover:text-white cursor-pointer transition-colors">
          Documents
        </div>
        <div className="hover:text-white cursor-pointer transition-colors">
          AI Chat
        </div>
        <div className="hover:text-white cursor-pointer transition-colors">
          Analytics
        </div>
      </nav>
    </aside>
  )
}
