import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nombre: true, correo: true, tipo: true, estado: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(usuarios)
  } catch {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}
