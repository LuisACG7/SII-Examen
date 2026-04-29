"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, CheckCircle2, AlertCircle, BarChart3, Mail, User, LayoutDashboard } from "lucide-react";

// 1. Interfaces de datos
interface EstudianteData {
  numero_control: string;
  email: string;
  persona: string;
  foto: string;
  promedio_ponderado: number;
  promedio_aritmetico: number;
  porcentaje_avance: number;
  materias_cursadas: string;
  materias_aprobadas: string;
  materias_reprobadas: string;
  semestre: number;
  creditos_acumulados: string;
  num_materias_rep_segunda: number;
  num_materias_rep_primera: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  text?: string;
  icon?: React.ReactNode;
}

interface DetailRowProps {
  label: string;
  value: string | number;
  color?: string;
}

export default function Dashboard() {
  const [estudiante, setEstudiante] = useState<EstudianteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDatos = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }

      try {
        const res = await fetch("/api/estudiante", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });
        const result = await res.json();
        if (res.ok) { 
          setEstudiante(result.data); 
        } else {
          if (res.status === 401) { 
            localStorage.removeItem("token"); 
            router.push("/login"); 
          }
          setError(result.message || "Error al cargar datos");
        }
      } catch (err) { 
        setError("Error de conexión"); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchDatos();
  }, [router]);

  // --- Pantalla de Carga para Dashboard (Azul Marino) ---
  if (loading) {
    return (
      <div className="h-[90vh] flex flex-col items-center justify-center bg-blue-950 rounded-[2.5rem] m-4 md:m-8 text-white shadow-2xl">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute animate-ping h-20 w-20 rounded-full bg-green-500/20"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
          {/* Cambiado a LayoutDashboard para el contexto del Dashboard */}
          <LayoutDashboard className="absolute text-green-500" size={24} />
        </div>
        <p className="font-black tracking-[0.3em] animate-pulse text-sm uppercase">
          Preparando tu panel...
        </p>
      </div>
    );
  }

  if (error || !estudiante) return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
        <p className="text-red-500 font-bold mb-6">⚠️ {error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold">Reintentar</button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* TARJETA DE BIENVENIDA */}
      <div className="bg-white rounded-[2rem] shadow-sm p-8 mb-8 flex flex-col md:flex-row items-center gap-8 border-l-[12px] border-green-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <User size={120} />
        </div>
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-50 shadow-inner bg-gray-100">
          <img 
            src={`data:image/jpeg;base64,${estudiante.foto}`} 
            alt="Perfil" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-blue-950 uppercase leading-none mb-2">{estudiante.persona}</h2>
          <div className="flex flex-col gap-1 mb-4">
            <p className="text-gray-400 font-bold tracking-tighter flex items-center justify-center md:justify-start gap-2">
              CONTROL: <span className="text-blue-700">{estudiante.numero_control}</span>
            </p>
            <p className="text-gray-400 font-bold tracking-tighter flex items-center justify-center md:justify-start gap-2 text-sm">
              <Mail size={14} className="text-blue-400" /> <span>{estudiante.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-lg text-xs font-black uppercase tracking-widest">Semestre: {estudiante.semestre}</span>
            <span className="bg-green-50 text-green-700 px-4 py-1 rounded-lg text-xs font-black uppercase tracking-widest">Carrera: ISC</span>
          </div>
        </div>
      </div>

      {/* CUADRICULA DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Promedio" 
          value={Number(estudiante.promedio_ponderado).toFixed(2)}
          color="border-blue-600" 
          text="text-blue-700"
          icon={<TrendingUp size={16} className="text-blue-600" />}
        />
        <StatCard 
          label="Avance" 
          value={`${estudiante.porcentaje_avance}%`} 
          color="border-purple-600" 
          text="text-purple-700" 
          icon={<BarChart3 size={16} className="text-purple-600" />}
        />
        <StatCard 
          label="Reprobadas" 
          value={estudiante.materias_reprobadas} 
          color="border-red-600" 
          text="text-red-600" 
          icon={<AlertCircle size={16} className="text-red-600" />}
        />
        <StatCard 
          label="Aprobadas" 
          value={estudiante.materias_aprobadas} 
          color="text-green-600" 
          text="text-green-600"
          icon={<CheckCircle2 size={16} className="text-green-600" />}
        />
      </div>

      {/* DETALLE ACADÉMICO */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h4 className="font-black text-blue-950 mb-6 border-b pb-4 text-xs uppercase tracking-widest">Detalle Académico</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow label="Materias Cursadas" value={estudiante.materias_cursadas} />
            <DetailRow label="Créditos Acumulados" value={estudiante.creditos_acumulados} color="text-green-600" />
            <DetailRow label="Promedio Ponderado" value={Number(estudiante.promedio_ponderado).toFixed(2)} />
            <DetailRow label="Promedio Aritmético" value={Number(estudiante.promedio_aritmetico).toFixed(2)} />
            <DetailRow label="Materias en Primera" value={estudiante.num_materias_rep_primera} />
            <DetailRow label="Materias en Segunda" value={estudiante.num_materias_rep_segunda} />
          </div>
        </div>
        
        <div className="bg-blue-900 p-8 rounded-[2rem] shadow-xl text-white flex flex-col justify-center items-center text-center">
          <h4 className="text-xl font-black mb-2 uppercase italic tracking-tighter">¡Adelante Lince!</h4>
          <p className="text-white text-sm font-bold opacity-90 leading-relaxed mb-6">
            Mantén tu promedio para asegurar tu horario el próximo semestre.
          </p>
          <div className="p-5 bg-white/10 rounded-2xl border border-white/20 w-full">
            <p className="text-[10px] uppercase font-bold text-blue-300 mb-1">Tu Estatus</p>
            <p className="font-black text-xl tracking-tight">ALUMNO REGULAR</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes Auxiliares
const StatCard = ({ label, value, color, text = "text-black", icon }: StatCardProps) => (
  <div className={`bg-white p-6 rounded-[2rem] shadow-sm border-b-8 ${color} flex flex-col items-center hover:translate-y-[-4px] transition-all cursor-default`}>
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest">{label}</p>
    </div>
    <h3 className={`text-4xl font-black ${text}`}>{value}</h3>
  </div>
);

const DetailRow = ({ label, value, color = "text-black" }: DetailRowProps) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
    <span className="text-[10px] font-bold text-gray-400 uppercase">{label}</span>
    <span className={`font-black text-sm ${color}`}>{value}</span>
  </div>
);