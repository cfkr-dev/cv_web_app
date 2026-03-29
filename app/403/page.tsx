import { ShieldAlert } from "lucide-react"

import { StatusPage } from "@/components/status-page"

export default function ForbiddenPage() {
  return (
    <StatusPage
      code="403"
      eyebrow="Acceso restringido"
      title="No tienes permisos para acceder a esta pagina."
      description="El recurso solicitado existe, pero tu cuenta no dispone de autorizacion suficiente para verlo."
      icon={ShieldAlert}
      highlights={[
        "Comprueba que has iniciado sesion con la cuenta correcta.",
        "Algunas areas pueden estar reservadas a roles o perfiles concretos.",
        "Si crees que es un error, contacta con soporte para revisar permisos.",
      ]}
      actions={[
        { href: "/login", label: "Ir al inicio de sesion" },
        { href: "/contact", label: "Contactar con soporte", variant: "secondary" },
        { href: "/", label: "Volver al inicio", variant: "outline" },
      ]}
    />
  )
}
