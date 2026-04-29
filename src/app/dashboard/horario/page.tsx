"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Calendar, MapPin, GraduationCap } from "lucide-react";

// --- Interfaces ---
interface HorarioDetalle {
  id_grupo: number;
  nombre_materia: string;
  clave_materia: string;
  letra_grupo: string;
  lunes: string | null;
  lunes_clave_salon: string | null;
  martes: string | null;
  martes_clave_salon: string | null;
  miercoles: string | null;
  miercoles_clave_salon: string | null;
  jueves: string | null;
  jueves_clave_salon: string | null;
  viernes: string | null;
  viernes_clave_salon: string | null;
  sabado: string | null;
  sabado_clave_salon: string | null;
}

interface PeriodoData {
  periodo: { descripcion_periodo: string };
  horario: HorarioDetalle[];
}

const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

// --- Paleta de 10 colores únicos para materias ---
const COLORES_MATERIAS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-orange-500",
  "bg-rose-600",
  "bg-amber-500",
  "bg-cyan-600",
  "bg-indigo-600",
  "bg-fuchsia-600",
  "bg-lime-600",
];

export default function HorarioPage() {
  const [data, setData] = useState<PeriodoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [colorMap, setColorMap] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchHorario = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/horarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (res.ok) {
          const horarioData = result.data || result;
          setData(horarioData);
          
          // Generar mapa de colores único por materia
          const rawHorario = horarioData[0]?.horario || [];
          const map: { [key: string]: string } = {};
          rawHorario.forEach((item: HorarioDetalle, index: number) => {
            if (!map[item.clave_materia]) {
              map[item.clave_materia] = COLORES_MATERIAS[index % COLORES_MATERIAS.length];
            }
          });
          setColorMap(map);
        }
      } catch (err) {
        console.error("Error cargando horario:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHorario();
  }, [router]);

  // Función para ordenar por hora (ej: "07:00-08:00")
  const ordenarPorHora = (a: HorarioDetalle, b: HorarioDetalle, dia: string) => {
    const horaA = (a[dia as keyof HorarioDetalle] as string) || "00:00";
    const horaB = (b[dia as keyof HorarioDetalle] as string) || "00:00";
    return horaA.localeCompare(horaB);
  };

  if (loading) {
    return (
      <div className="h-[90vh] flex flex-col items-center justify-center bg-blue-950 rounded-[2.5rem] m-4 md:m-8 text-white shadow-2xl">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute animate-ping h-20 w-20 rounded-full bg-blue-500/20"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
          <Calendar className="absolute text-blue-400" size={24} />
        </div>
        <p className="font-black tracking-[0.3em] animate-pulse text-sm">CARGANDO TU AGENDA</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <header className="mb-12">
        <div className="flex items-center gap-3 text-blue-600 mb-2">
          <Clock size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Periodo: {data[0]?.periodo.descripcion_periodo || "Cargando..."}
          </span>
        </div>
        <h1 className="text-5xl font-black text-blue-950 uppercase tracking-tighter leading-none">
          Mi <span className="text-blue-600">Horario</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DIAS.map((dia) => {
          // 1. Filtrar materias del día
          // 2. Ordenar por hora de inicio
          const clasesDelDia = data[0]?.horario
            .filter((h) => h[dia as keyof HorarioDetalle] !== null)
            .sort((a, b) => ordenarPorHora(a, b, dia));

          if (!clasesDelDia || clasesDelDia.length === 0) return null;

          return (
            <div key={dia} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
              <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tight border-b-4 border-blue-50 pb-2 mb-2">
                {dia === "miercoles" ? "Miércoles" : dia.charAt(0).toUpperCase() + dia.slice(1)}
              </h2>
              
              <div className="space-y-4">
                {clasesDelDia.map((clase, idx) => (
                  <div key={idx} className="group p-4 rounded-2xl bg-gray-50 border-2 border-transparent hover:border-blue-200 hover:bg-white transition-all shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      {/* Badge con color único por materia */}
                      <span className={`text-[10px] font-black ${colorMap[clase.clave_materia]} text-white px-2.5 py-1 rounded-lg uppercase tracking-wider`}>
                        {clase[dia as keyof HorarioDetalle]}
                      </span>
                      {/* Contenedor del Salón con etiqueta superior */}
<div className="flex flex-col items-end gap-0.5">
  <span className="text-[7px] font-black text-blue-600 uppercase tracking-widest leading-none mr-1">
    Salón
  </span>
  <div className="flex items-center gap-1 text-black font-black text-[11px] bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm leading-none">
    <MapPin size={10} className="text-blue-600" />
    {clase[`${dia}_clave_salon` as keyof HorarioDetalle] || "S/A"}
  </div>
</div>
                    </div>
                    <h4 className="font-black text-blue-950 text-sm leading-tight uppercase group-hover:text-blue-600 transition-colors">
                      {clase.nombre_materia}
                    </h4>
                    <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">
                      {clase.clave_materia} • GRP {clase.letra_grupo}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {(!data[0]?.horario || data[0].horario.length === 0) && (
        <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-black text-xl uppercase tracking-tighter">No hay clases registradas en este periodo.</p>
        </div>
      )}
    </div>
  );
}