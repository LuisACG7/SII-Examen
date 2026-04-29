import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    // Si no hay header, devolvemos 401 antes de intentar llamar al SII
    if (!authHeader) {
      return NextResponse.json({ message: "No se proporcionó token" }, { status: 401 });
    }

    const res = await fetch("https://sii.celaya.tecnm.mx/api/movil/estudiante", {
      method: "GET",
      headers: {
        "Authorization": authHeader, // Esto debe ser "Bearer <token>"
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Error en el servidor proxy" }, { status: 500 });
  }
}