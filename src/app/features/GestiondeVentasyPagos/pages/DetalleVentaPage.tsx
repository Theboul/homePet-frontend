import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { useGetClientesQuery } from '#/app/features/Gestionar_Clientes_Mascotas/Gestionar_Clientes/store/gestionarClientesApi'
import { useGetClientesMascotaQuery } from '#/app/features/Gestionar_Clientes_Mascotas/Gestionar_Mascotas/store/gestionarMascotasApi'
import { useGetUsuariosQuery } from '#/app/features/AutenticacionySeguridad/Gestionar_Usuarios/store/gestionarUsuariosApi'
import { useAppSelector } from '#/store/hooks'
import { DetallesVentaTable } from '../components/DetallesVentaTable'
import { VentaEstadoBadge } from '../components/VentaEstadoBadge'
import { VentaResumenCard } from '../components/VentaResumenCard'
import { useGetVentaByIdQuery } from '../services/ventasService'
import {
  formatDateTime,
  getVentaClienteRefId,
  getVentaClienteNombre,
  getVentaDetalles,
  getVentaEstado,
  getVentaMascotaNombre,
  getVentaObservacion,
  getVentaTotal,
  getVentaUsuarioResponsableRefId,
  getVentaUsuarioNombre,
  hasProductoDetalle,
  hasServicioDetalle,
} from '../utils/ventasFormatters'
import { canAccessVentasModule } from '../utils/ventasGuards'
import { getVentasApiErrorMessage } from '../utils/ventasValidators'

type DetalleVentaPageProps = {
  ventaId: number
}

function getVentaObservacionSafe(observacion?: string | null) {
  return observacion?.trim() ? observacion : '-'
}

export function DetalleVentaPage({ ventaId }: DetalleVentaPageProps) {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const canAccess = canAccessVentasModule(user)

  const clientesQuery = useGetClientesQuery({ page: 1, page_size: 200 }, { skip: !canAccess })
  const clientesUsuariosQuery = useGetClientesMascotaQuery(undefined, { skip: !canAccess })
  const usuariosQuery = useGetUsuariosQuery(undefined, { skip: !canAccess })
  const ventaQuery = useGetVentaByIdQuery(ventaId, { skip: !canAccess || ventaId <= 0 })
  const detalles = useMemo(() => getVentaDetalles(ventaQuery.data), [ventaQuery.data])
  const venta = ventaQuery.data ?? null
  const clientes = clientesQuery.data?.results ?? []
  const clientesUsuarios = clientesUsuariosQuery.data ?? []
  const usuariosSistema = usuariosQuery.data ?? []

  const clientNameById = useMemo(() => {
    const map = new Map<number, string>()

    clientesUsuarios.forEach((cliente) => {
      const label = cliente.nombre || `Cliente ${cliente.id_usuario}`
      map.set(cliente.id_usuario, label)
    })

    clientes.forEach((cliente) => {
      const label = cliente.nombre || cliente.correo || `Cliente ${cliente.id_perfil}`
      map.set(cliente.id_perfil, label)
      map.set(cliente.usuario, label)
    })
    return map
  }, [clientes, clientesUsuarios])

  const usuarioSistemaById = useMemo(() => {
    const map = new Map<number, string>()
    usuariosSistema.forEach((usuario) => {
      const label = usuario.nombre || usuario.correo || `Usuario ${usuario.id_usuario ?? usuario.id}`
      if (usuario.id_usuario) map.set(usuario.id_usuario, label)
      map.set(usuario.id, label)
    })
    return map
  }, [usuariosSistema])

  const clienteNombre = useMemo(() => {
    if (!venta) return 'Sin cliente'
    const id = getVentaClienteRefId(venta)
    if (id > 0) {
      const fromMap = clientNameById.get(id)
      if (fromMap) return fromMap
      return `Cliente #${id}`
    }
    return getVentaClienteNombre(venta)
  }, [clientNameById, venta])

  const usuarioResponsableNombre = useMemo(() => {
    if (!venta) return '-'
    const id = getVentaUsuarioResponsableRefId(venta)
    const fallbackName = id > 0 && id === user?.id_usuario ? user.nombre || user.correo || '-' : null
    if (id > 0) {
      const fromMap = usuarioSistemaById.get(id)
      if (fromMap) return fromMap
    }
    const fromVenta = getVentaUsuarioNombre(venta, { fallbackName })
    if (fromVenta !== '-' && fromVenta.trim() !== '') return fromVenta
    if (id > 0) return `Usuario #${id}`
    return fallbackName ?? '-'
  }, [user?.correo, user?.id_usuario, user?.nombre, usuarioSistemaById, venta])

  if (!canAccess) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-5 text-sm font-medium text-red-700">
          No tiene permisos para acceder al módulo de ventas.
        </CardContent>
      </Card>
    )
  }

  if (ventaQuery.isLoading) {
    return (
      <Card className="border-violet-100">
        <CardContent className="p-5 text-sm text-slate-600">Cargando detalle de venta...</CardContent>
      </Card>
    )
  }

  if (ventaQuery.error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-5 text-sm text-red-700">
          {getVentasApiErrorMessage(ventaQuery.error, 'No se pudo cargar el detalle de la venta.')}
        </CardContent>
      </Card>
    )
  }

  if (!ventaQuery.data) {
    return (
      <Card className="border-violet-100">
        <CardContent className="p-5 text-sm text-slate-600">La venta no existe.</CardContent>
      </Card>
    )
  }

  const hasProducts = hasProductoDetalle(detalles)
  const hasServices = hasServicioDetalle(detalles)

  return (
    <section className="space-y-5 text-slate-900">
      <div>
        <h1 className="text-5xl font-black text-slate-900">Detalle de venta</h1>
        <p className="mt-1 text-sm text-slate-600">
          Consulta de cabecera, detalles y movimientos asociados
        </p>
      </div>

      <Card className="border-violet-100">
        <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_220px]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-4xl font-black text-slate-900">Venta #{ventaId}</h2>
              <VentaEstadoBadge estado={getVentaEstado(venta)} />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Fecha: {formatDateTime(venta.fecha_venta ?? venta.fecha ?? venta.created_at)}
            </p>
            <div className="grid gap-1 text-sm text-slate-700 md:grid-cols-2">
              <p>
                <span className="font-semibold">Cliente:</span> {clienteNombre}
              </p>
              <p>
                <span className="font-semibold">Usuario responsable:</span> {usuarioResponsableNombre}
              </p>
              <p>
                <span className="font-semibold">Mascota:</span> {getVentaMascotaNombre(venta)}
              </p>
              <p>
                <span className="font-semibold">Observación:</span>{' '}
                {getVentaObservacionSafe(getVentaObservacion(venta))}
              </p>
            </div>
          </div>
          <VentaResumenCard title="Total" amount={getVentaTotal(venta)} />
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900">Detalles</h2>
        <DetallesVentaTable detalles={detalles} />
      </div>

      <div className="space-y-2">
        {hasProducts ? (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-4 text-sm font-medium text-emerald-700">
              Movimiento de inventario: el stock disminuyó en el almacén principal.
            </CardContent>
          </Card>
        ) : null}
        {hasServices ? (
          <Card className="border-violet-200 bg-violet-50">
            <CardContent className="p-4 text-sm font-medium text-violet-700">
              Nota clínica: este módulo no genera historia clínica automáticamente.
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Button
        type="button"
        onClick={() => navigate({ to: '/ventas-pagos/ventas' })}
        className="h-10 bg-[#6A24D4] px-8 font-semibold text-white hover:bg-[#5b1fbc]"
      >
        Volver
      </Button>
    </section>
  )
}
