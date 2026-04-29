import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const res = await fetch("https://sii.celaya.tecnm.mx/api/movil/estudiante/calificaciones", {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Error al obtener datos del SII" }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en el router de calificaciones:", error);
    return NextResponse.json(
      { message: "Error interno en el servidor" }, 
      { status: 500 }
    );
  }
}