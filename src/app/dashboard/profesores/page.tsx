"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Heart, MessageSquare, Star, Search, ChevronDown, ChevronUp, Send } from "lucide-react";

// Definimos las interfaces para quitar el error de "Unexpected any m"
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
  es_favorito: boolean;
  comentarios: Comentario[];
}

export default function ProfesoresPage() {
  // Ahora usamos la interfaz en el estado
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState("");

  useEffect(() => {
    fetchProfesores();
  }, []);

  async function fetchProfesores() {
    const { data, error } = await supabase
      .from('profesores')
      .select('*, comentarios(*)')
      .order('nombre');
    
    if (error) {
      console.error("Error al traer profes:", error);
    } else if (data) {
      setProfesores(data as Profesor[]);
    }
  }

  async function agregarComentario(profesorId: string) {
    if (!nuevoComentario.trim()) return;

    const { error } = await supabase.from('comentarios').insert([
      { 
        profesor_id: profesorId, 
        usuario: "Estudiante", // Aquí podrías poner el nombre real si tuvieras auth
        texto: nuevoComentario 
      }
    ]);

    if (!error) {
      setNuevoComentario("");
      fetchProfesores(); // Recargamos para ver el nuevo comentario
    } else {
      alert("Error al guardar comentario");
    }
  }

  const profesFiltrados = profesores.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <header className="bg-blue-900 text-white p-6 rounded-t-[2rem] shadow-lg">
        <h1 className="text-2xl font-black uppercase tracking-tight">Profesores Favoritos</h1>
        <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">
          Consulta y opina sobre tus docentes
        </p>
      </header>

      {/* Buscador */}
      <div className="bg-white p-4 border-b border-gray-100 shadow-sm flex items-center gap-4">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="BUSCAR PROFESOR..." 
          className="bg-transparent w-full text-xs font-bold focus:outline-none"
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Lista */}
      <div className="mt-6 space-y-4">
        {profesFiltrados.map((profe) => (
          <div key={profe.id} className="bg-white border-2 border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:border-blue-200 transition-all">
            <div className="p-6 flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center text-white font-black">
                {profe.nombre.substring(0,2)}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-black text-blue-950 uppercase leading-none">{profe.nombre}</h3>
                <p className="text-green-600 font-bold text-xs uppercase mt-1">{profe.materia}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-sm font-black">{profe.calificacion}</span>
                </div>
              </div>
              <Heart 
                size={24} 
                className={profe.es_favorito ? "text-red-500 fill-red-500" : "text-gray-200"} 
              />
            </div>

            <div className="bg-gray-50 border-t px-6 py-3 flex justify-between items-center">
              <button 
                onClick={() => setExpandedId(expandedId === profe.id ? null : profe.id)} 
                className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-900"
              >
                <MessageSquare size={14} /> 
                Ver comentarios ({profe.comentarios?.length || 0}) 
                {expandedId === profe.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Sección expandible de comentarios */}
            {expandedId === profe.id && (
              <div className="p-6 bg-white border-t space-y-4">
                <div className="space-y-2">
                  {profe.comentarios?.map((c) => (
                    <div key={c.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-black text-blue-900 uppercase">{c.usuario}</p>
                      <p className="text-xs text-gray-600">{c.texto}</p>
                    </div>
                  ))}
                  {(!profe.comentarios || profe.comentarios.length === 0) && (
                    <p className="text-center text-[10px] text-gray-400 font-bold uppercase py-2">No hay comentarios aún</p>
                  )}
                </div>
                
                {/* Input para nuevo comentario */}
                <div className="flex gap-2 mt-4">
                  <input 
                    type="text" 
                    placeholder="Escribe un comentario..." 
                    className="flex-grow bg-gray-50 border p-3 rounded-xl text-xs focus:ring-2 focus:ring-blue-900 outline-none"
                    value={nuevoComentario} 
                    onChange={(e) => setNuevoComentario(e.target.value)}
                  />
                  <button 
                    onClick={() => agregarComentario(profe.id)} 
                    className="bg-blue-900 text-white p-3 rounded-xl hover:bg-blue-800 transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}