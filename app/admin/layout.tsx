"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, LayoutDashboard, FolderOpen, Plus, Settings, User, LogOut, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

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
    },
    {
      name: "Perfil",
      href: "/admin/perfil",
      icon: User,
      current: pathname === "/admin/perfil",
    },
    {
      name: "Configuración",
      href: "/admin/configuracion",
      icon: Settings,
      current: pathname === "/admin/configuracion",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-8">
                <Heart className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-xl font-bold text-gray-900">DonaTutti</span>
              </Link>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Área de Administración
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Ver Sitio Público
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Mi Perfil
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen border-r">
          <div className="p-4">
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
          <div className="absolute bottom-0 w-64 p-4 border-t bg-gray-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">FP</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Fundación Patitas</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
