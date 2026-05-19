import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function validateId(id: string) {
  const num = Number(id)
  if (isNaN(num) || num <= 0) return { error: "ID inválido", status: 400 }
  return num
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const id = validateId(params.id)
    if (typeof id !== "number") return NextResponse.json(id, { status: id.status })

    const { estado } = await req.json()
    await prisma.usuario.update({ where: { id }, data: { estado } })

    return NextResponse.json({ message: "Usuario actualizado" })
  } catch {
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}
