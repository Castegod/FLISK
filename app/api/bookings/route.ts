import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendBookingConfirmation } from "@/lib/email"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const all = searchParams.get("all")

    if (all === "true") {
      if (session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 })
      }
      const reservas = await prisma.reserva.findMany({
        include: { usuario: { select: { nombre: true, correo: true } }, espacio: { select: { nombre: true } } },
        orderBy: { fecha: "desc" },
      })
      return NextResponse.json(reservas)
    }

    const reservas = await prisma.reserva.findMany({
      where: { usuarioId: Number(session.user.id) },
      include: { espacio: { select: { nombre: true, tipo: true } } },
      orderBy: { fecha: "desc" },
    })

    return NextResponse.json(reservas)
  } catch {
    return NextResponse.json({ error: "Error al obtener reservas" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { espacioId, fecha, horaInicio, horaFin } = await req.json()

    if (!espacioId || !fecha || !horaInicio || !horaFin) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    const conflicto = await prisma.reserva.findFirst({
      where: {
        espacioId,
        fecha: new Date(fecha),
        estado: { not: "CANCELADA" },
        OR: [
          { horaInicio: { lt: horaFin }, horaFin: { gt: horaInicio } },
        ],
      },
    })

    if (conflicto) {
      return NextResponse.json({ error: "El espacio no está disponible en ese horario" }, { status: 409 })
    }

    const reserva = await prisma.reserva.create({
      data: {
        fecha: new Date(fecha),
        horaInicio,
        horaFin,
        usuarioId: Number(session.user.id),
        espacioId,
      },
    })

    const espacio = await prisma.espacio.findUnique({ where: { id: espacioId } })
    const usuario = await prisma.usuario.findUnique({ where: { id: Number(session.user.id) } })

    if (usuario && espacio) {
      sendBookingConfirmation(usuario.correo, usuario.nombre, espacio.nombre, fecha, horaInicio, horaFin).catch(() => {})
    }

    return NextResponse.json(reserva, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error al crear reserva" }, { status: 500 })
  }
}
