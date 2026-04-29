"use client";

import React, { useState } from "react";
import { 
  UserPlus, 
  Heart, 
  MessageSquare, 
  Trash2, 
  Star, 
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// --- Interfaces para la Funcionalidad ---
interface Comentario {
  id: string;
  usuario: string;
  texto: string;
  fecha: string;
}

interface Profesor {
  id: string;
  nombre: string;
  materia: string;
  departamento: string;
  calificacion: number;
  esFavorito: boolean;
  comentarios: Comentario[];
}

// --- Datos Iniciales (Simulando Backend Propio) ---
const INITIAL_PROFESORES: Profesor[] = [
  {
    id: "1",
    nombre: "OSCAR GRIMALDO AGUAYO",
    materia: "TOPICOS WEB",
    departamento: "Sistemas Computacionales",
    calificacion: 5.0,
    esFavorito: true,
    comentarios: [{ id: "c1", usuario: "Ricardo", texto: "Excelente profesor, explica muy claro.", fecha: "28/04/2026" }]
  },
  {
    id: "2",
    nombre: "RUBEN TORRES FRIAS",
    materia: "PROGRAMACIÓN MÓVIL",
    departamento: "Sistemas Computacionales",
    calificacion: 5.0,
    esFavorito: true,
    comentarios: [{ id: "c1", usuario: "Luis", texto: "Sus clases son muy dinámicas; explica con tanta claridad que los temas se vuelven fáciles de seguir y entender.", fecha: "28/04/2026" }]
  },
  {
    id: "3",
    nombre: "DONATO",
    materia: "ARQUITECTURA DE COMPUTADORAS",
    departamento: "Sistemas Computacionales",
    calificacion: 4.0,
    esFavorito: false,
    comentarios: []
  }
];

export default function ProfesoresFavoritos() {
  const [profesores, setProfesores] = useState<Profesor[]>(INITIAL_PROFESORES);
  const [filtro, setFiltro] = useState<"todos" | "favoritos">("todos");
  const [busqueda, setBusqueda] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // --- Lógica de la funcionalidad ---
  const toggleFavorito = (id: string) => {
    setProfesores(prev => prev.map(p => 
      p.id === id ? { ...p, esFavorito: !p.esFavorito } : p
    ));
  };

  const eliminarProfesor = (id: string) => {
    if(confirm("¿Eliminar de tu lista personalizada?")) {
      setProfesores(prev => prev.filter(p => p.id !== id));
    }
  };

  const profesFiltrados = profesores.filter(p => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return filtro === "todos" ? coincideBusqueda : (coincideBusqueda && p.esFavorito);
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header Estilo SII */}
      <header className="bg-blue-900 text-white p-6 rounded-t-[2rem] shadow-lg">
        <h1 className="text-2xl font-black uppercase tracking-tight">Profesores Favoritos</h1>
        <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">
          Guarda y comenta sobre tus profesores
        </p>
      </header>

      {/* Barra de Herramientas */}
      <div className="bg-white p-4 border-x border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setFiltro("todos")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${filtro === 'todos' ? 'bg-blue-900 text-white shadow-md' : 'text-gray-500 hover:text-blue-900'}`}
          >
            Todos ({profesores.length})
          </button>
          <button 
            onClick={() => setFiltro("favoritos")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${filtro === 'favoritos' ? 'bg-blue-900 text-white shadow-md' : 'text-gray-500 hover:text-blue-900'}`}
          >
            Favoritos ({profesores.filter(p => p.esFavorito).length})
          </button>
        </div>

        <div className="flex gap-3 flex-grow md:flex-grow-0">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="BUSCAR PROFESOR..."
              className="pl-12 pr-6 py-4 bg-gray-50 border-none rounded-xl text-xs font-bold w-full focus:ring-2 focus:ring-blue-900"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase transition-all shadow-md shadow-emerald-100">
            <UserPlus size={16} />
            <span className="hidden md:inline">Agregar Profesor</span>
          </button>
        </div>
      </div>

      {/* Lista de Profesores */}
      <div className="mt-6 space-y-4">
        {profesFiltrados.map((profe) => (
          <div key={profe.id} className="bg-white border-2 border-gray-100 rounded-[2rem] overflow-hidden hover:border-emerald-500/30 transition-all shadow-sm">
            <div className="p-6 flex flex-col md:flex-row items-center gap-6">
              {/* Iniciales */}
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-white font-black text-xl shadow-inner">
                {profe.nombre.split(" ").map(n => n[0]).join("").substring(0,2)}
              </div>

              {/* Info Principal */}
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-lg font-black text-blue-950 uppercase leading-none">{profe.nombre}</h3>
                <p className="text-green-600 font-bold text-xs uppercase mt-1">{profe.materia}</p>
                <p className="text-black-400 font-bold text-[10px] uppercase tracking-widest">{profe.departamento}</p>
                
                <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                  <Star size={16} className="text-red-600 -400 fill-red-600" />
                  <span className="text-sm font-black">{profe.calificacion.toFixed(1)}</span>
                  <span className="text-[10px] text-black-400 font-black ml-2 uppercase">
                    {profe.comentarios.length} comentario(s)
                  </span>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleFavorito(profe.id)}
                  className={`p-3 rounded-2xl transition-all ${profe.esFavorito ? 'bg-rose-50 text-red-500 shadow-inner' : 'bg-gray-50 text-gray-300 hover:text-rose-400'}`}
                >
                  <Heart size={20} fill={profe.esFavorito ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={() => eliminarProfesor(profe.id)}
                  className="p-3 bg-gray-50 text-gray-300 hover:bg-rose-100 hover:text-rose-600 rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Footer de la tarjeta: Comentarios */}
            <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-3 flex justify-between items-center">
              <button 
                onClick={() => setExpandedId(expandedId === profe.id ? null : profe.id)}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-900 hover:text-blue-600 transition-colors"
              >
                <MessageSquare size={14} />
                Ver comentarios
                {expandedId === profe.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 hover:underline">
                <Star size={14} />
                Opinar sobre el profe
              </button>
            </div>

            {/* Sección de Comentarios Expandible */}
            {expandedId === profe.id && (
              <div className="p-6 bg-white border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                {profe.comentarios.length > 0 ? (
                  <div className="space-y-3">
                    {profe.comentarios.map(c => (
                      <div key={c.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] font-black uppercase text-blue-900">{c.usuario}</span>
                          <span className="text-[10px] font-bold text-gray-400">{c.fecha}</span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">{c.texto}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    No hay comentarios todavía. ¡Sé el primero!
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}