import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendBookingCancelled } from "@/lib/email"

function validateId(id: string) {
  const num = Number(id)
  if (isNaN(num) || num <= 0) return { error: "ID inválido", status: 400 }
  return num
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const id = validateId(params.id)
    if (typeof id !== "number") return NextResponse.json(id, { status: id.status })

    const reserva = await prisma.reserva.findUnique({
      where: { id },
      include: { usuario: true, espacio: true },
    })

    if (!reserva) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 })
    }

    if (reserva.usuarioId !== Number(session.user.id) && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    await prisma.reserva.update({ where: { id }, data: { estado: "CANCELADA" } })

    sendBookingCancelled(
      reserva.usuario.correo, reserva.usuario.nombre, reserva.espacio.nombre, reserva.fecha.toLocaleDateString()
    ).catch(() => {})

    return NextResponse.json({ message: "Reserva cancelada" })
  } catch {
    return NextResponse.json({ error: "Error al cancelar reserva" }, { status: 500 })
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

    const { estado } = await req.json()
    const reserva = await prisma.reserva.update({
      where: { id },
      data: { estado },
      include: { usuario: true, espacio: true },
    })

    if (estado === "CANCELADA") {
      sendBookingCancelled(
        reserva.usuario.correo, reserva.usuario.nombre, reserva.espacio.nombre, reserva.fecha.toLocaleDateString()
      ).catch(() => {})
    }

    return NextResponse.json({ message: "Reserva actualizada" })
  } catch {
    return NextResponse.json({ error: "Error al actualizar reserva" }, { status: 500 })
  }
}
