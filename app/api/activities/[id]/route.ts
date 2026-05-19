import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function validateId(id: string) {
  const num = Number(id)
  if (isNaN(num) || num <= 0) {
    return { error: "ID inválido", status: 400 }
  }
  return num
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = validateId(params.id)
    if (typeof id !== "number") return NextResponse.json(id, { status: id.status })

    const actividad = await prisma.actividad.findUnique({
      where: { id },
      include: { _count: { select: { inscripciones: true } } },
    })

    if (!actividad) {
      return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 })
    }

    return NextResponse.json({
      ...actividad,
      inscripcionesCount: actividad._count.inscripciones,
      cuposDisponibles: actividad.cupoMaximo - actividad._count.inscripciones,
    })
  } catch {
    return NextResponse.json({ error: "Error al obtener actividad" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const id = validateId(params.id)
    if (typeof id !== "number") return NextResponse.json(id, { status: id.status })

    const body = await req.json()
    const actividad = await prisma.actividad.update({ where: { id }, data: body })
    return NextResponse.json(actividad)
  } catch {
    return NextResponse.json({ error: "Error al actualizar actividad" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const id = validateId(params.id)
    if (typeof id !== "number") return NextResponse.json(id, { status: id.status })

    await prisma.actividad.update({ where: { id }, data: { activa: false } })
    return NextResponse.json({ message: "Actividad desactivada" })
  } catch {
    return NextResponse.json({ error: "Error al desactivar actividad" }, { status: 500 })
  }
}
