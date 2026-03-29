import { Wrench } from "lucide-react"

import { StatusPage } from "@/components/status-page"

export default function MaintenancePage() {
  return (
    <StatusPage
      code="503"
      eyebrow="Mantenimiento"
      title="MyWorkSpace esta temporalmente en mantenimiento."
      description="Estamos realizando tareas tecnicas para mejorar la plataforma. Vuelve a intentarlo mas tarde."
      icon={Wrench}
      highlights={[
        "El mantenimiento puede afectar al acceso, registro o visualizacion de perfiles.",
        "Normalmente estas tareas son temporales y finalizan en poco tiempo.",
        "Si necesitas ayuda urgente, puedes escribir al canal de contacto.",
      ]}
      actions={[
        { href: "/", label: "Volver al inicio" },
        { href: "/contact", label: "Contactar", variant: "secondary" },
      ]}
    />
  )
}
