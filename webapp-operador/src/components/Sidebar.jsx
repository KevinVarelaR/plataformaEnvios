import React from "react"
import { NavLink } from "react-router-dom"
import { Home, Package, Map, Truck } from "lucide-react"

export default function Sidebar() {
  const base     = "flex items-center px-4 py-2 rounded-md"
  const active   = "bg-blue-100 text-blue-600"
  const inactive = "text-gray-600 hover:bg-gray-50 hover:text-gray-900"

  const links = [
    { to: "/",               label: "Inicio",        icon: <Home    className="mr-3 h-5 w-5" /> },
    { to: "/paquetes",       label: "Paquetes",      icon: <Package className="mr-3 h-5 w-5" /> },
    { to: "/paquetes/nuevo", label: "Nuevo Paquete", icon: <Package className="mr-3 h-5 w-5" /> },
    { to: "/rutas",          label: "Rutas",         icon: <Map     className="mr-3 h-5 w-5" /> },
    { to: "/entregas",       label: "Entregas",      icon: <Truck   className="mr-3 h-5 w-5" /> },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10">
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">WebApp Operador</span>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
