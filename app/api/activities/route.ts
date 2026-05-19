import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const activa = searchParams.get("activa")

    const where: Record<string, unknown> = {}
    if (activa !== null) where.activa = activa === "true"

    const actividades = await prisma.actividad.findMany({ where, orderBy: { fecha: "asc" } })
    return NextResponse.json(actividades)
  } catch {
    return NextResponse.json({ error: "Error al obtener actividades" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const body = await req.json()
    const actividad = await prisma.actividad.create({ data: body })
    return NextResponse.json(actividad, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error al crear actividad" }, { status: 500 })
  }
}
