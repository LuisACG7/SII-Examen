"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, UserPlus, Save, X, GraduationCap } from "lucide-react";

// 1. Definimos la interfaz para evitar el error "Unexpected any"
interface Profesor {
  id: string;
  nombre: string;
  materia: string;
  departamento: string;
  calificacion: number;
  created_at?: string;
}

export default function AdminProfesores() {
  // 2. Aplicamos la interfaz al estado
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ 
    nombre: "", 
    materia: "", 
    departamento: "", 
    calificacion: 5 
  });

  useEffect(() => { 
    fetchProfesores(); 
  }, []);

  async function fetchProfesores() {
    const { data, error } = await supabase
      .from('profesores')
      .select('*')
      .order('nombre', { ascending: true });
    
    if (error) {
      console.error("Error cargando profesores:", error.message);
    } else if (data) {
      setProfesores(data as Profesor[]);
    }
  }

  async function guardarProfesor() {
    // Validación simple antes de enviar
    if (!form.nombre || !form.materia) {
      alert("Por favor rellena los campos principales");
      return;
    }

    const { error } = await supabase.from('profesores').insert([form]);
    
    if (!error) {
      setIsAdding(false);
      setForm({ nombre: "", materia: "", departamento: "", calificacion: 5 });
      fetchProfesores();
    } else {
      console.error("Error al insertar:", error.message);
    }
  }

  async function eliminarProfesor(id: string) {
    if (confirm("¿Seguro de eliminar este profesor del sistema? Esta acción no se puede deshacer.")) {
      const { error } = await supabase
        .from('profesores')
        .delete()
        .eq('id', id);
      
      if (!error) {
        fetchProfesores();
      } else {
        alert("Error al eliminar: " + error.message);
      }
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Header del Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tighter flex items-center gap-2">
            <GraduationCap className="text-emerald-600" size={32} />
            Control de Docentes
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
            Administración de catálogo SII
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black uppercase text-xs transition-all shadow-lg shadow-emerald-100"
        >
          <UserPlus size={18} /> Nuevo Registro
        </button>
      </div>

      {/* Formulario de Alta */}
      {isAdding && (
        <div className="bg-white p-6 rounded-[2.5rem] border-4 border-emerald-50 mb-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nombre del Docente</label>
              <input type="text" placeholder="EJ. OSCAR GRIMALDO" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500" 
                value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value.toUpperCase()})}/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Asignatura / Materia</label>
              <input type="text" placeholder="EJ. TÓPICOS WEB" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500" 
                value={form.materia} onChange={e => setForm({...form, materia: e.target.value.toUpperCase()})}/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Departamento</label>
              <input type="text" placeholder="SISTEMAS COMPUTACIONALES" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500" 
                value={form.departamento} onChange={e => setForm({...form, departamento: e.target.value.toUpperCase()})}/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Calificación Inicial</label>
              <input type="number" min="0" max="5" step="0.1" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500" 
                value={form.calificacion} onChange={e => setForm({...form, calificacion: Number(e.target.value)})}/>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={guardarProfesor} className="bg-blue-950 text-white flex-grow py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors">
              <Save size={18}/> Confirmar y Subir a Supabase
            </button>
            <button onClick={() => setIsAdding(false)} className="bg-gray-100 text-gray-500 px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-gray-200">
              <X size={18}/>
            </button>
          </div>
        </div>
      )}

      {/* Tabla de Registros */}
      <div className="bg-white rounded-[2rem] border-2 border-gray-50 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-950 text-[10px] font-black uppercase text-blue-200">
            <tr>
              <th className="p-5">Información del Docente</th>
              <th className="p-5 hidden md:table-cell">Departamento</th>
              <th className="p-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {profesores.map(p => (
              <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="font-black text-blue-950 text-sm uppercase">{p.nombre}</span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">{p.materia}</span>
                  </div>
                </td>
                <td className="p-5 hidden md:table-cell">
                  <span className="text-[10px] font-black text-gray-400 uppercase">{p.departamento || 'N/A'}</span>
                </td>
                <td className="p-5 text-right">
                  <button 
                    onClick={() => eliminarProfesor(p.id)} 
                    className="text-gray-300 hover:text-red-600 hover:bg-red-50 p-3 rounded-xl transition-all"
                    title="Eliminar registro"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {profesores.length === 0 && (
              <tr>
                <td colSpan={3} className="p-10 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                  No hay profesores registrados en la base de datos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}