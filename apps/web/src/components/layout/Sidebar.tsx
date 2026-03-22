'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, Megaphone, CreditCard,
  ShieldCheck, Wrench, CalendarCheck, BarChart2,
  AlertTriangle, LogOut, Car, ChevronLeft, ChevronRight, ScanLine,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import { useResident } from '@/context/ResidentContext'
import logo from '@/components/images/logo.png'

const adminOnlyRoutes = ['/residents']

const navItems = [
  { label: 'Dashboard',     href: '/dashboard',    icon: LayoutDashboard, adminOnly: false },
  { label: 'Residents',     href: '/residents',    icon: Users,           adminOnly: true  },
  { label: 'Announcements', href: '/announcements',icon: Megaphone,       adminOnly: false },
  { label: 'Levies & Dues', href: '/levies',       icon: CreditCard,      adminOnly: false },
  { label: 'Visitors',      href: '/visitors',     icon: ShieldCheck,     adminOnly: false },
  { label: 'Maintenance',   href: '/maintenance',  icon: Wrench,          adminOnly: false },
  { label: 'Facilities',    href: '/facilities',   icon: CalendarCheck,   adminOnly: false },
  { label: 'Polls',         href: '/polls',        icon: BarChart2,       adminOnly: false },
  { label: 'Incidents',     href: '/incidents',    icon: AlertTriangle,   adminOnly: false },
  { label: 'Vehicles',      href: '/vehicles',     icon: Car,             adminOnly: false },
  { label: 'Gate scanner',  href: '/vehicles/scan', icon: ScanLine, adminOnly: false },
]

export default function Sidebar() {
  const pathname              = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { isAdmin }           = useResident()

  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin)

  return (
    <aside className={cn(
      'relative flex flex-col bg-gray-900 text-white transition-all duration-300 min-h-screen shrink-0',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-gray-800',
        collapsed && 'justify-center px-2'
      )}>
        <Image
          src={logo}
          alt="EstateIQ"
          height={20}
          width={70}
          className={cn(
            'object-contain shrink-0',
            collapsed && 'h-2.5 w-[1.75rem] object-center'
          )}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors',
                collapsed && 'justify-center px-2',
                active
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-2 pb-4 border-t border-gray-800 pt-3">
        <button
          onClick={() => signOut({ callbackUrl: '/sign-in' })}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(p => !p)}
        className="absolute -right-3 top-6 bg-gray-900 border border-gray-700 rounded-full p-0.5 text-gray-400 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  )
}