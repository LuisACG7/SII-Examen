"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Calendar, Map, Heart, LogOut, NotebookPen } from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar = ({ onLogout }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <NotebookPen size={20} />, label: "Calificaciones", path: "/dashboard/calificaciones" },
    { icon: <Calendar size={20} />, label: "Horario", path: "/dashboard/horario" },
    { icon: <BookOpen size={20} />, label: "Kardex", path: "/dashboard/kardex" },
    /*{ icon: <Map size={20} />, label: "Campus", path: "/dashboard/campus" },*/
    { icon: <Heart size={20} />, label: "Profesores Favoritos", path: "/dashboard/profesores" },
  ];

  return (
    <aside className="w-64 bg-blue-950 min-h-screen text-white flex flex-col p-4 shadow-xl sticky top-0">
      {/* Encabezado con Estilo Lince */}
      <div className="mb-10 text-center font-black text-xl border-b border-blue-800 pb-4">
        SII <span className="text-green-500">ITC</span>
        <p className="text-[10px] text-blue-300 tracking-widest font-bold uppercase mt-1">TecNM Celaya</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item, index) => {
          // Usamos .startsWith para que el botón se mantenga activo si hay subrutas
          const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));

          return (
            <Link 
              key={index} 
              href={item.path}
              // Agregamos prefetch={true} para que la navegación sea instantánea
              prefetch={true}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-800 border-l-4 border-green-500 text-white shadow-inner' 
                  : 'text-gray-400 hover:bg-blue-900/50 hover:text-white'
              }`}
            >
              <span className={`${isActive ? 'text-green-400' : 'group-hover:text-white'} transition-colors`}>
                {item.icon}
              </span>
              <span className="font-bold text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Botón de Salida con Estilo de Advertencia */}
      <button 
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 p-4 rounded-xl text-red-400 hover:bg-red-900/20 hover:text-red-500 transition-all font-black text-sm border border-red-900/30"
      >
        <LogOut size={20} /> 
        CERRAR SESIÓN
      </button>
    </aside>
  );
};