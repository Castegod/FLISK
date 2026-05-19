import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)
const from = process.env.EMAIL_FROM || "noreply@filsk.app"

export async function sendWelcomeEmail(to: string, nombre: string) {
  await resend.emails.send({
    from,
    to,
    subject: "Bienvenido a FILSK",
    html: `
      <h2>¡Bienvenido a FILSK, ${nombre}!</h2>
      <p>Tu cuenta ha sido creada exitosamente.</p>
      <p>Ya puedes reservar espacios e inscribirte en actividades de Bienestar Universitario.</p>
    `,
  })
}

export async function sendBookingConfirmation(to: string, nombre: string, espacio: string, fecha: string, horaInicio: string, horaFin: string) {
  await resend.emails.send({
    from,
    to,
    subject: "Reserva confirmada - FILSK",
    html: `
      <h2>Reserva confirmada</h2>
      <p>Hola ${nombre},</p>
      <p>Tu reserva en <strong>${espacio}</strong> ha sido registrada.</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Horario:</strong> ${horaInicio} - ${horaFin}</p>
    `,
  })
}

export async function sendBookingCancelled(to: string, nombre: string, espacio: string, fecha: string) {
  await resend.emails.send({
    from,
    to,
    subject: "Reserva cancelada - FILSK",
    html: `
      <h2>Reserva cancelada</h2>
      <p>Hola ${nombre},</p>
      <p>Tu reserva en <strong>${espacio}</strong> del ${fecha} ha sido cancelada.</p>
    `,
  })
}

export async function sendInscriptionConfirmation(to: string, nombre: string, actividad: string, fecha: string, lugar: string) {
  await resend.emails.send({
    from,
    to,
    subject: "Inscripción confirmada - FILSK",
    html: `
      <h2>Inscripción confirmada</h2>
      <p>Hola ${nombre},</p>
      <p>Te has inscrito en <strong>${actividad}</strong>.</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Lugar:</strong> ${lugar}</p>
    `,
  })
}
