"use client";

import { useEffect, useState } from "react";
import { GraduationCap, PieChart, NotebookPen, Library } from "lucide-react";

// --- Interfaces Estrictas ---
interface MateriaKardex {
  nombre_materia: string;
  clave_materia: string;
  periodo: string;
  creditos: string;
  calificacion: string;
  descripcion: string;
  semestre: number;
}

interface KardexData {
  porcentaje_avance: number;
  kardex: MateriaKardex[];
}

interface SemestresAcumulador {
  [key: number]: MateriaKardex[];
}

// Configuración de colores para los semestres (7 colores para 7 semestres, con repetición si hay más de 7)
const SEMESTER_COLORS = [  
  "bg-blue-600",    // Semestre 1
  "bg-emerald-600", // Semestre 2
  "bg-violet-600",  // Semestre 3
  "bg-orange-500",  // Semestre 4
  "bg-rose-600",   // Semestre 5
  "bg-cyan-600",    // Semestre 6
  "bg-amber-500",   // Semestre 7
];

export default function KardexPage() {
  const [data, setData] = useState<KardexData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKardex = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/kardex", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.flag) setData(result.data);
      } catch (err) {
        console.error("Error al obtener kardex:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchKardex();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-blue-900 uppercase tracking-widest animate-pulse">Cargando Historial...</p>
      </div>
    );
  }

  const semestres = data?.kardex.reduce<SemestresAcumulador>((acc, curr) => {
    const sem = curr.semestre;
    if (!acc[sem]) acc[sem] = [];
    // Si la calificación no existe, es nula o vacía, asignamos "0"
    const materiaValida = {
      ...curr,
      calificacion: curr.calificacion && curr.calificacion !== "" ? curr.calificacion : "0"
    };
    acc[sem].push(materiaValida);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-700">
      {/* Header con Progreso */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-5">
          <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-lg shadow-blue-100">
            <GraduationCap size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-blue-950 uppercase tracking-tighter">
              Mi <span className="text-blue-600">Kardex</span>
            </h1>
            <p className="text-green-600 font-bold text-[10px] md:text-xs uppercase mt-1 tracking-widest">
               Kardex del alumno • Historial
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-5 bg-blue-50/50 px-8 py-5 rounded-[2rem] border border-blue-100">
          <div className="text-right">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Avance Total</p>
            <p className="text-3xl font-black text-blue-950 leading-none mt-1">{data?.porcentaje_avance}%</p>
          </div>
          <div className="relative flex items-center justify-center">
            <PieChart size={28} className="text-blue-600" />
            <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full scale-150"></div>
          </div>
        </div>
      </header>

      {/* Listado por Semestres */}
      <div className="space-y-4">
        {semestres && Object.keys(semestres).sort((a, b) => Number(a) - Number(b)).map((semKey, index) => {
          const sem = Number(semKey);
          // Seleccionar color del arreglo según el índice (con fallback por si hay más de 14)
          const colorClass = SEMESTER_COLORS[index % SEMESTER_COLORS.length];

          return (
            <section key={sem} className={`${sem > 1 ? 'mt-20' : 'mt-0'} relative animate-in slide-in-from-bottom-4 duration-500`}>
              <div className="flex items-center gap-4 mb-10">
                <div className={`${colorClass} text-white px-6 py-2.5 rounded-2xl flex items-center gap-3 shadow-lg`}>
                  <Library size={18} />
                  <span className="font-black text-base uppercase tracking-wider">Semestre {sem}</span>
                </div>
                <div className="h-[2px] bg-gradient-to-r from-gray-200 to-transparent flex-grow"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {semestres[sem].map((materia, idx) => {
                  const nota = Number(materia.calificacion);
                  const isAprobada = nota >= 70;
                  
                  return (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-blue-200 transition-all flex justify-between items-center group shadow-sm hover:shadow-xl hover:-translate-y-1">
                      <div className="flex gap-4 items-center">
                        <div className={`p-3 rounded-2xl ${isAprobada ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                          <NotebookPen size={22} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-blue-950 text-[14px] uppercase leading-tight group-hover:text-blue-600 transition-colors">
                            {materia.nombre_materia}
                          </h4>
                          <div className="flex gap-2 text-[10px] font-black uppercase tracking-tight">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-blue-700">{materia.clave_materia}</span>
                            <span className="py-0.5 text-blue-500 font-bold">{materia.creditos} Créditos</span>
                            <span className="py-0.5 text-red-400 italic">{materia.descripcion}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end min-w-[70px]">
                        <span className={`text-3xl font-black tracking-tighter ${isAprobada ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {materia.calificacion === "0" ? "0" : materia.calificacion}
                        </span>
                        <span className="text-[10px] font-black text-blue-900/40 uppercase leading-none tracking-tighter">Calificación</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}