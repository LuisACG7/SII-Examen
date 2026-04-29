"use client";

import { Sidebar } from "@/components/Sidebar";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* El Sidebar se queda fijo aquí */}
      <Sidebar onLogout={handleLogout} />
      
      {/* Aquí se cargarán las páginas: dashboard, calificaciones, etc. */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}