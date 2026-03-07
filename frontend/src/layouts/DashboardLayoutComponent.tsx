import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UsersIcon,
  ShieldCheckIcon,
  LogOutIcon,
  ChevronRightIcon,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/useAuth'

const navItems = [
  { to: '/dashboard/users', label: 'Users', icon: UsersIcon },
  { to: '/dashboard/roles', label: 'Roles', icon: ShieldCheckIcon },
]

export default function DashboardLayoutComponent() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const currentPage = location.pathname.split('/')[2] || 'Users'

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-50 font-sans overflow-hidden">
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-64 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-950"
      >
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="text-[0.95rem] font-semibold tracking-tight text-zinc-100">
              Management System
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="px-3 py-2 text-sm font-normal tracking-widest text-zinc-400">
            Main Menu
          </p>
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname.includes(to)
            return (
              <Link
                key={to}
                to={to}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-50'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  {label}
                </span>
                {isActive && (
                  <ChevronRightIcon size={14} className="text-zinc-500" />
                )}
              </Link>
            )
          })}
        </nav>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <motion.header
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="h-16 flex items-center justify-between px-8 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10"
        >
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="text-zinc-400">Dashboard</span>
            <span>/</span>
            <span className="text-zinc-400 capitalize">{currentPage}</span>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-900 transition-colors cursor-default">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                    <span className="text-zinc-200 text-xs font-bold">
                      {user?.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">
                      {user?.full_name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 bg-zinc-900 border-zinc-800"
              >
                <DropdownMenuItem
                  className="text-zinc-300 focus:text-red-500 cursor-pointer gap-2"
                  onClick={handleLogout}
                >
                  <LogOutIcon size={14} />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.header>

        <main className="flex-1 p-8 bg-zinc-950 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
