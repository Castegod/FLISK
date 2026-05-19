import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tipo = searchParams.get("tipo")
    const activo = searchParams.get("activo")

    const where: Record<string, unknown> = {}
    if (tipo) where.tipo = tipo
    if (activo !== null) where.activo = activo === "true"

    const espacios = await prisma.espacio.findMany({ where, orderBy: { nombre: "asc" } })
    return NextResponse.json(espacios)
  } catch {
    return NextResponse.json({ error: "Error al obtener espacios" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const body = await req.json()
    const espacio = await prisma.espacio.create({ data: body })
    return NextResponse.json(espacio, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error al crear espacio" }, { status: 500 })
  }
}
