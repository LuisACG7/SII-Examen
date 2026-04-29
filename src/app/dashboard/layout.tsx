"use client";

import { Sidebar } from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* 🔹 SIDEBAR EN DESKTOP */}
      <div className="hidden md:block">
        <Sidebar onLogout={handleLogout} />
      </div>

      {/* 🔹 SIDEBAR EN MÓVIL (OVERLAY) */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          
          {/* Fondo oscuro */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar */}
          <div className="w-64 bg-white h-full shadow-xl">
            <Sidebar onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* 🔹 CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto">
        
        {/* 🔸 HEADER MÓVIL */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          
          {/* Botón hamburguesa */}
          <button
            onClick={() => setOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>

          <h1 className="font-bold text-gray-700">
            Dashboard
          </h1>

          {/* Espacio para balancear */}
          <div />
        </div>

        {/* 🔸 CONTENIDO DINÁMICO */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}