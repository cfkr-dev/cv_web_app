import { ServerCrash } from "lucide-react"

import { StatusPage } from "@/components/status-page"

export default function ServerErrorPage() {
  return (
    <StatusPage
      code="500"
      eyebrow="Error del servidor"
      title="Se ha producido un error interno."
      description="Algo ha fallado mientras intentabamos procesar la solicitud. Puedes volver a intentarlo en unos minutos."
      icon={ServerCrash}
      highlights={[
        "Este tipo de error suele ser temporal y puede resolverse al reintentar.",
        "Si el problema persiste, conviene revisar logs o informar al equipo tecnico.",
        "Tambien puedes volver a una zona segura de la aplicacion mientras tanto.",
      ]}
      actions={[
        { href: "/", label: "Volver al inicio" },
        { href: "/contact", label: "Informar del problema", variant: "secondary" },
        { href: "/login", label: "Ir al login", variant: "outline" },
      ]}
    />
  )
}
