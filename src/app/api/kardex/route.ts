import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");

  try {
    const res = await fetch("https://sii.celaya.tecnm.mx/api/movil/estudiante/kardex", {
      headers: {
        "Authorization": authHeader || "",
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error al conectar con el servidor" }, { status: 500 });
  }
}