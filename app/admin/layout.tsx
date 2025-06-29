"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, LayoutDashboard, FolderOpen, Plus, Settings, User, LogOut, Home } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/authContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  
  // Check if user is admin to show sidebar
  const isAdmin = user?.role?.name === 'admin'

  // Handle logout with redirect to home
  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    {
      name: "Mis Campañas",
      href: "/admin/campanas",
      icon: FolderOpen,
      current: pathname.startsWith("/admin/campanas") && pathname !== "/admin/campanas/crear",
    },
    {
      name: "Crear Campaña",
      href: "/admin/campanas/crear",
      icon: Plus,
      current: pathname === "/admin/campanas/crear",
    }
    //{
    //  name: "Perfil",
    //  href: "/admin/perfil",
    //  icon: User,
    //  current: pathname === "/admin/perfil",
    //},
    //{
    //  name: "Configuración",
    //  href: "/admin/configuracion",
    //  icon: Settings,
    //  current: pathname === "/admin/configuracion",
    //},
    
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Only show for admin users */}
        {isAdmin && (
          <nav className="fixed left-0 top-0 w-64 bg-white shadow-sm h-screen border-r flex flex-col z-10">
            {/* Logo and Badge */}
            <div className="p-4 border-b bg-gray-50/50">
              <div className="flex flex-col space-y-2">
                <Link href="/" className="flex items-center">
                  <Heart className="h-8 w-8 text-red-500 mr-2" />
                  <span className="text-xl font-bold text-gray-900">DonaTutti</span>
                </Link>
                <Badge className="bg-blue-100 text-blue-800 w-fit">
                  Área de Administración
                </Badge>
              </div>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                        ${
                          item.current
                            ? "bg-orange-50 text-orange-800 border-r-2 border-orange-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* User Info */}
            <div className="w-64 p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email}
                    </p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-8 ${!isAdmin ? 'max-w-4xl mx-auto' : 'ml-64'}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
