"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, GraduationCap, Award, ChevronRight, NotebookPen, Library } from "lucide-react";

// --- Interfaces ---
interface Calificacion {
  id_calificacion: number;
  numero_calificacion: number;
  calificacion: string | null;
}

interface Materia {
  materia: {
    id_grupo: number;
    nombre_materia: string;
    clave_materia: string;
    letra_grupo: string;
  };
  calificaiones: Calificacion[];
}

interface PeriodoData {
  periodo: {
    clave_periodo: string;
    anio: number;
    descripcion_periodo: string;
  };
  materias: Materia[];
}

export default function CalificacionesPage() {
  const [data, setData] = useState<PeriodoData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCalificaciones = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/calificaciones", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        
        if (res.ok) {
          setData(result.data || result);
        }
      } catch (err) {
        console.error("Error al cargar calificaciones:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalificaciones();
  }, [router]);

  // --- Lógica de Colores Actualizada ---
  // Verde: >= 85 | Amarillo: 70 - 84 | Rojo: < 70
  const getNotaStyle = (notaStr: string | null) => {
    if (!notaStr || notaStr === "-" || notaStr === "") {
      return "bg-gray-50 text-gray-300 border-gray-100";
    }
    const nota = Number(notaStr);
    if (nota >= 85) return "bg-green-50 text-green-700 border-green-200";
    if (nota >= 70) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const getCalificacionFinal = (calificaciones: Calificacion[]) => {
    const validas = calificaciones
      .filter((c) => c.calificacion !== null && c.calificacion !== "" && !isNaN(Number(c.calificacion)))
      .map((c) => Number(c.calificacion));
    if (validas.length === 0) return 0;
    return validas.reduce((a, b) => a + b, 0) / validas.length;
  };

  const filteredMaterias = (data || []).flatMap((p) =>
    (p.materias || [])
      .filter(
        (m) =>
          m.materia.nombre_materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.periodo.descripcion_periodo.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((m) => ({ ...m, periodoDesc: p.periodo.descripcion_periodo }))
  );

  if (loading) {
    return (
      <div className="h-[90vh] flex flex-col items-center justify-center bg-blue-950 rounded-[2.5rem] m-4 md:m-8 text-white shadow-2xl">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute animate-ping h-20 w-20 rounded-full bg-green-500/20"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
          <GraduationCap className="absolute text-green-500" size={24} />
        </div>
        <p className="font-black tracking-[0.3em] animate-pulse text-sm">CARGANDO HISTORIAL ACADÉMICO</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-green-600 mb-2">
            <Award size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Estatus: Alumno Regular</span>
          </div>
          <h1 className="text-5xl font-black text-blue-950 uppercase tracking-tighter leading-none">
            Materias <span className="text-green-600">Inscritas</span>
          </h1>
          <p className="text-gray-400 font-medium italic">Consulta tu progreso académico del ITC</p>
        </div>

        <div className="relative group w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar materia o periodo..."
            className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-green-600 shadow-sm transition-all font-bold text-blue-950"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {filteredMaterias.length > 0 ? (
          filteredMaterias.map((item, idx) => {
            const final = getCalificacionFinal(item.calificaiones);
            const finalStyle = getNotaStyle(final > 0 ? final.toString() : null);

            return (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-100 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
              >
                <div className="flex items-center gap-6">
                  {/* Nuevo Icono de Materia (NotebookPen) */}
                  <div className={`p-5 rounded-3xl ${finalStyle} border-2 transition-all group-hover:scale-110 shadow-inner`}>
                    <NotebookPen size={30} />
                  </div>
                  <div>
                    <h3 className="font-black text-blue-950 text-xl leading-tight mb-1">
                      {item.materia.nombre_materia}
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                        {item.materia.clave_materia} • GRP {item.materia.letra_grupo}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        {item.periodoDesc}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-10 border-t lg:border-t-0 pt-6 lg:pt-0">
                  {/* Unidades con Colores Individuales */}
                  <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
                    {item.calificaiones.map((c, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <span className="text-[9px] font-black text-gray-300 uppercase">U{c.numero_calificacion}</span>
                        <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black text-sm transition-colors ${getNotaStyle(c.calificacion)}`}>
                          {c.calificacion || "-"}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promedio Final */}
                  <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                    <div className={`w-20 h-20 rounded-[1.8rem] flex flex-col items-center justify-center border-4 ${finalStyle} shadow-lg transition-transform group-hover:scale-105`}>
                      <span className="text-[9px] font-black uppercase tracking-widest mb-0.5">FINAL</span>
                      <span className="text-3xl font-black">{final > 0 ? final.toFixed(0) : "N/A"}</span>
                    </div>
                    <ChevronRight className="text-gray-200 group-hover:text-green-600 group-hover:translate-x-2 transition-all" size={28} />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-[3rem] p-24 text-center border-4 border-dashed border-gray-100">
            <Library className="mx-auto text-gray-200 mb-6" size={80} />
            <p className="text-gray-400 font-black text-xl uppercase tracking-tighter">No se encontraron resultados</p>
          </div>
        )}
      </div>
    </div>
  );
}