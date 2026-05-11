import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Plus, Route as RouteIcon, Truck } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { useAppSelector } from '#/store/hooks'
import {
  useCreateUnidadMovilMutation,
  useGetUnidadesMovilesQuery,
} from '../../Rutas_Programadas/store/rutasProgramadasApi'

function loadPersistedAuthUser() {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem('homePet_auth')
    if (!raw) return null
    const parsed = JSON.parse(raw) as {
      user?: {
        role?: string
      } | null
    }
    return parsed.user ?? null
  } catch {
    return null
  }
}

function normalizeRole(value?: string | null) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
}

function isClientRole(value?: string | null) {
  return normalizeRole(value).includes('CLIENT')
}

function CreateUnitDialog({
  open,
  onOpenChange,
  onSubmit,
  isSaving,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: { nombre: string; placa?: string; descripcion?: string }) => Promise<void>
  isSaving: boolean
}) {
  const [nombre, setNombre] = useState('')
  const [placa, setPlaca] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setNombre('')
    setPlaca('')
    setDescripcion('')
    setError(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) reset()
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-violet-700">
            Registrar unidad móvil
          </DialogTitle>
          <DialogDescription>
            Crea el camión o unidad que luego podrás asignar a las rutas programadas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Nombre de la unidad"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
          />
          <Input
            placeholder="Placa"
            value={placa}
            onChange={(event) => setPlaca(event.target.value)}
          />
          <Input
            placeholder="Descripción opcional"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
          />
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset()
              onOpenChange(false)
            }}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-violet-600 text-white hover:bg-violet-700"
            disabled={isSaving}
            onClick={async () => {
              if (!nombre.trim()) {
                setError('El nombre de la unidad es obligatorio.')
                return
              }

              setError(null)
              await onSubmit({
                nombre: nombre.trim(),
                placa: placa.trim() || undefined,
                descripcion: descripcion.trim() || undefined,
              })
                .then(() => {
                  reset()
                })
                .catch((submitError: unknown) => {
                  setError(
                    submitError instanceof Error
                      ? submitError.message
                      : 'No se pudo registrar la unidad móvil.',
                  )
                })
            }}
          >
            Guardar unidad
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object') {
    const payload = (error as { data?: unknown }).data
    if (typeof payload === 'string') return payload
    if (payload && typeof payload === 'object') {
      const firstValue = Object.values(payload as Record<string, unknown>)[0]
      if (typeof firstValue === 'string') return firstValue
      if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') {
        return firstValue[0]
      }
    }
  }
  return fallback
}

export function UnidadesMovilesPage() {
  const authUser = useAppSelector((state) => state.auth.user)
  const persistedUser = useMemo(() => loadPersistedAuthUser(), [])
  const user = authUser ?? persistedUser
  const [dialogOpen, setDialogOpen] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const canAccess = Boolean(user) && !isClientRole(user?.role)

  const {
    data: unidades = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetUnidadesMovilesQuery(undefined, {
    skip: !canAccess,
  })
  const [createUnidadMovil, createUnidadState] = useCreateUnidadMovilMutation()

  async function handleCreateUnit(payload: {
    nombre: string
    placa?: string
    descripcion?: string
  }) {
    try {
      await createUnidadMovil(payload).unwrap()
      setFeedback('Unidad móvil creada correctamente.')
      setDialogOpen(false)
    } catch (submitError) {
      throw new Error(getApiErrorMessage(submitError, 'No se pudo registrar la unidad móvil.'))
    }
  }

  if (!canAccess) {
    return (
      <section className="space-y-5 text-gray-900">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-8">
            <h1 className="text-3xl font-black text-amber-900">Unidades móviles</h1>
            <p className="mt-2 text-amber-800">
              Esta vista está disponible únicamente para usuarios internos.
            </p>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="space-y-5 text-gray-900">
      <CreateUnitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateUnit}
        isSaving={createUnidadState.isLoading}
      />

      <div className="grid gap-5 xl:grid-cols-[1.8fr_0.9fr]">
        <Card className="overflow-hidden border-violet-100 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.16),_rgba(255,255,255,0.98)_55%)] shadow-sm">
          <CardContent className="space-y-4 p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/75 px-4 py-1 text-xs font-bold uppercase tracking-[0.28em] text-violet-700">
              <Truck className="h-4 w-4" />
              Unidad móvil
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-orange-600">
                Gestión de unidades móviles
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-700">
                Registra los camiones o móviles de tu veterinaria y luego asígnalos a rutas
                programadas sin mezclar esta operación con el detalle del recorrido.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-violet-100 shadow-sm">
          <CardContent className="space-y-3 p-7">
            <h2 className="text-sm font-bold uppercase tracking-[0.28em] text-violet-700">
              Acciones
            </h2>
            <Button
              type="button"
              className="w-full bg-violet-600 text-white hover:bg-violet-700"
              onClick={() => {
                setFeedback(null)
                setDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva unidad
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-violet-200 text-violet-700 hover:bg-violet-50"
              asChild
            >
              <Link to="/Rutas_Programadas">
                <RouteIcon className="mr-2 h-4 w-4" />
                Ir a rutas
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-violet-200 text-violet-700 hover:bg-violet-50"
              onClick={() => {
                void refetch()
              }}
            >
              Actualizar listado
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-violet-100">
          <CardContent className="p-6">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">
              Total unidades
            </p>
            <p className="mt-3 text-5xl font-black text-violet-700">{unidades.length}</p>
          </CardContent>
        </Card>
        <Card className="border-violet-100">
          <CardContent className="p-6">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">
              Activas
            </p>
            <p className="mt-3 text-5xl font-black text-emerald-600">
              {unidades.filter((item) => item.estado).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-violet-100">
          <CardContent className="p-6">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">
              Inactivas
            </p>
            <p className="mt-3 text-5xl font-black text-slate-500">
              {unidades.filter((item) => !item.estado).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {feedback ? (
        <div className="rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-violet-700">
          {feedback}
        </div>
      ) : null}

      {isLoading ? (
        <Card className="border-violet-100">
          <CardContent className="p-8 text-sm text-gray-600">Cargando unidades móviles...</CardContent>
        </Card>
      ) : isError ? (
        <Card className="border-rose-100">
          <CardContent className="space-y-3 p-8">
            <p className="text-sm text-rose-700">
              {getApiErrorMessage(error, 'No se pudo cargar el listado de unidades móviles.')}
            </p>
            <Button
              type="button"
              variant="outline"
              className="border-rose-200 text-rose-700 hover:bg-rose-50"
              onClick={() => {
                void refetch()
              }}
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : unidades.length === 0 ? (
        <Card className="border-dashed border-violet-200 bg-white/90">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900">Todavía no hay unidades móviles</h2>
            <p className="mt-2 text-sm text-gray-600">
              Registra aquí tus camiones o móviles para luego usarlos al crear rutas programadas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {unidades.map((unidad) => (
            <Card key={unidad.id_unidad} className="border-violet-100 bg-white shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{unidad.nombre}</h3>
                    <p className="text-sm text-slate-600">{unidad.placa || 'Sin placa registrada'}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      unidad.estado
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {unidad.estado ? 'ACTIVA' : 'INACTIVA'}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-700">
                  {unidad.descripcion || 'Sin descripción adicional para esta unidad móvil.'}
                </p>
                <div className="rounded-xl bg-violet-50 p-3 text-xs font-medium uppercase tracking-[0.18em] text-violet-700">
                  ID unidad: {unidad.id_unidad}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isFetching && !isLoading ? (
        <p className="text-sm text-violet-700">Actualizando unidades móviles...</p>
      ) : null}
    </section>
  )
}
