"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Importación necesaria para optimización
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, llena todos los campos");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Credenciales incorrectas");
        return;
      }

      const token = data.message?.login?.token;

      if (token) {
        localStorage.setItem("token", token);
        router.push("/dashboard");
      } else {
        setError("El servidor no devolvió un token válido");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#003B71] to-[#005a41]">
      
      {/* ESPACIO PARA LOGO CIRCULAR */}
      <div className="flex justify-center pt-10 pb-6">
        {/* Contenedor circular con overflow-hidden para recortar el fondo del logo */}
        <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-[#005a41] overflow-hidden">
          <Image 
            src="/logo.png" 
            alt="Logo ITC" 
            width={160}
            height={160}
            priority
            /* scale-110 ayuda a que el Lince llene mejor el círculo */
            className="w-full h-full object-cover scale-110" 
          />
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex flex-1 items-start justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[450px] overflow-hidden">

          {/* CABECERA AZUL/VERDE */}
          <div className="bg-gradient-to-r from-[#005a41] to-[#003B71] text-white text-center py-8 px-6">
            <h2 className="text-3xl font-black tracking-tight italic">PORTAL ESTUDIANTIL</h2>
            <p className="text-sm opacity-90 mt-1 font-medium">
              Tecnológico Nacional de México en Celaya
            </p>
          </div>

          {/* FORMULARIO */}
          <div className="p-10 flex flex-col gap-6">
            <h3 className="text-center text-gray-500 font-medium">
              Ingresa con tus credenciales del <span className="text-[#003B71] font-bold">SII ITC</span>
            </h3>

            {/* MENSAJE DE ERROR */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm flex items-center gap-3 animate-pulse">
                <AlertCircle size={20} />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* CAMPO: CORREO */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Correo Institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="l12345678@celaya.tecnm.mx"
                className="w-full border-2 border-gray-100 rounded-xl p-4 bg-gray-50 text-gray-900 focus:border-[#003B71] focus:bg-white outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* CAMPO: CONTRASEÑA */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-2 border-gray-100 rounded-xl p-4 bg-gray-50 text-gray-900 focus:border-[#003B71] focus:bg-white outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#003B71]"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* BOTÓN DE ACCIÓN */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="mt-4 bg-[#003B71] hover:bg-[#002b52] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-blue-900/20"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={22} />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center font-medium mt-2">
              Usa las mismas credenciales del sistema SII ITC Celaya
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-center text-white/60 text-xs p-6 tracking-wide">
        © 2026 TecNM Campus Celaya — ISC
      </footer>
    </div>
  );
}