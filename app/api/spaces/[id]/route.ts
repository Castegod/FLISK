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

    const espacio = await prisma.espacio.findUnique({
      where: { id },
      include: { reservas: { where: { estado: { not: "CANCELADA" } } } },
    })

    if (!espacio) {
      return NextResponse.json({ error: "Espacio no encontrado" }, { status: 404 })
    }

    return NextResponse.json(espacio)
  } catch {
    return NextResponse.json({ error: "Error al obtener espacio" }, { status: 500 })
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
    const espacio = await prisma.espacio.update({ where: { id }, data: body })
    return NextResponse.json(espacio)
  } catch {
    return NextResponse.json({ error: "Error al actualizar espacio" }, { status: 500 })
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

    await prisma.espacio.update({ where: { id }, data: { activo: false } })
    return NextResponse.json({ message: "Espacio desactivado" })
  } catch {
    return NextResponse.json({ error: "Error al desactivar espacio" }, { status: 500 })
  }
}
