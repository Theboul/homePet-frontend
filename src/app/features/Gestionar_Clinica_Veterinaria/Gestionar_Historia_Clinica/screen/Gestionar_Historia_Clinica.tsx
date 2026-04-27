import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  useGetClinicalHistoriesQuery,
  useCreateClinicalHistoryMutation,
  type ClinicalHistory,
  type ConsultaClinica,
  type VacunaAplicada,
  type Tratamiento,
} from "../store"

import {
  useGetMascotasQuery,
  useGetClientesMascotaQuery,
} from "@/app/features/Gestionar_Clientes_Mascotas/Gestionar_Mascotas/store/gestionarMascotasApi"

import {
  NuevoHistorialClinicoDialog,
  NuevaConsultaDialog,
  HistorialClinicoDetailDialog,
  EditarHistorialClinicoDialog,
  TratamientoDialog,
  VacunaAplicadaDialog,
  ConsultaClinicaDetailDialog,
} from "../components"

function formatearFecha(fecha?: string | null) {
  if (!fecha) return "Sin fecha"

  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return fecha

  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function Gestionar_Historia_Clinica() {
  const [search, setSearch] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")

  const [openNuevoHistorial, setOpenNuevoHistorial] = useState(false)
  const [openNuevaConsulta, setOpenNuevaConsulta] = useState(false)
  const [openEditarConsulta, setOpenEditarConsulta] = useState(false)
  const [openDetalleHistorial, setOpenDetalleHistorial] = useState(false)
  const [openDetalleConsulta, setOpenDetalleConsulta] = useState(false)
  const [openEditarHistorial, setOpenEditarHistorial] = useState(false)

  const [openTratamientoDialog, setOpenTratamientoDialog] = useState(false)
  const [modoTratamiento, setModoTratamiento] = useState<"crear" | "editar">(
    "crear"
  )

  const [openVacunaDialog, setOpenVacunaDialog] = useState(false)
  const [modoVacuna, setModoVacuna] = useState<"crear" | "editar">("crear")

  const [historialSeleccionado, setHistorialSeleccionado] =
    useState<ClinicalHistory | null>(null)

  const [consultaSeleccionada, setConsultaSeleccionada] =
    useState<ConsultaClinica | null>(null)

  const [consultaTratamientoSeleccionada, setConsultaTratamientoSeleccionada] =
    useState<ConsultaClinica | null>(null)

  const [tratamientoSeleccionado, setTratamientoSeleccionado] =
    useState<Tratamiento | null>(null)

  const [consultaVacunaSeleccionada, setConsultaVacunaSeleccionada] =
    useState<ConsultaClinica | null>(null)

  const [vacunaSeleccionada, setVacunaSeleccionada] =
    useState<VacunaAplicada | null>(null)

  const {
    data: historiales = [],
    isLoading,
    isError,
    refetch,
  } = useGetClinicalHistoriesQuery()

  const [createClinicalHistory, { isLoading: isCreatingHistory }] =
    useCreateClinicalHistoryMutation()

  const { data: mascotas = [] } = useGetMascotasQuery()
  const { data: clientes = [] } = useGetClientesMascotaQuery()

  const mascotasAdaptadas = useMemo(() => {
    return mascotas.map((m: any) => ({
      id: m.id_mascota,
      nombre:
        typeof m.nombre === "string"
          ? m.nombre
          : m.nombre?.nombre ?? "",
      propietario_id:
        m.propietario_id ??
        m.id_usuario ??
        m.usuario?.id_usuario ??
        m.usuario?.id ??
        "",
      propietario_nombre:
        m.propietario_nombre ??
        m.usuario_nombre ??
        m.usuario?.perfil?.nombre ??
        m.usuario?.nombre ??
        m.propietario?.perfil?.nombre ??
        m.propietario?.nombre ??
        "",
      especie_nombre:
        typeof m.especie_nombre === "string"
          ? m.especie_nombre
          : typeof m.especie === "string"
            ? m.especie
            : m.especie?.nombre ?? "",
      raza_nombre:
        typeof m.raza_nombre === "string"
          ? m.raza_nombre
          : typeof m.raza === "string"
            ? m.raza
            : m.raza?.nombre ?? "",
    }))
  }, [mascotas])

  const propietariosAdaptados = useMemo(() => {
    return clientes.map((c: any) => ({
      id: c.id_usuario ?? c.id ?? "",
      nombre:
        c.nombre ??
        c.nombre_completo ??
        c.perfil_nombre ??
        c.perfil?.nombre ??
        c.correo ??
        "Cliente",
    }))
  }, [clientes])

  const filteredHistoriales = useMemo(() => {
    return historiales.filter((item: ClinicalHistory) => {
      const texto = search.toLowerCase()

      const coincideBusqueda =
        item.mascota_nombre?.toLowerCase().includes(texto) ||
        item.mascota_especie?.toLowerCase().includes(texto) ||
        item.mascota_raza?.toLowerCase().includes(texto) ||
        item.propietario_nombre?.toLowerCase().includes(texto) ||
        item.observaciones_generales?.toLowerCase().includes(texto)

      const totalConsultas = item.consultas_clinicas?.length || 0

      const coincideEstado =
        filterEstado === "todos" ||
        (filterEstado === "con_consultas" && totalConsultas > 0) ||
        (filterEstado === "sin_consultas" && totalConsultas === 0) ||
        (filterEstado === "activos" && item.estado) ||
        (filterEstado === "inactivos" && !item.estado)

      return coincideBusqueda && coincideEstado
    })
  }, [historiales, search, filterEstado])

  const stats = useMemo(() => {
    const total = historiales.length
    const activos = historiales.filter((item) => item.estado).length
    const totalConsultas = historiales.reduce(
      (acc, item) => acc + (item.consultas_clinicas?.length || 0),
      0
    )

    return {
      total,
      activos,
      totalConsultas,
    }
  }, [historiales])

  const handleNuevaConsulta = (historial: ClinicalHistory) => {
    setHistorialSeleccionado(historial)
    setOpenNuevaConsulta(true)
  }

  const handleVerDetalle = (historial: ClinicalHistory) => {
    setHistorialSeleccionado(historial)
    setOpenDetalleHistorial(true)
  }

  const handleVerDetalleConsulta = (consulta: ConsultaClinica) => {
    setConsultaSeleccionada(consulta)
    setOpenDetalleHistorial(false)
    setOpenDetalleConsulta(true)
  }

  const handleEditarConsulta = (consulta: ConsultaClinica) => {
    setConsultaSeleccionada(consulta)
    setOpenDetalleHistorial(false)
    setOpenEditarConsulta(true)
  }

  const handleEditarHistorial = () => {
    setOpenDetalleHistorial(false)
    setOpenEditarHistorial(true)
  }

  const handleAgregarTratamiento = (consulta: ConsultaClinica) => {
    setConsultaTratamientoSeleccionada(consulta)
    setTratamientoSeleccionado(null)
    setModoTratamiento("crear")
    setOpenDetalleHistorial(false)
    setOpenTratamientoDialog(true)
  }

  const handleEditarTratamiento = (
    consulta: ConsultaClinica,
    tratamiento: Tratamiento
  ) => {
    setConsultaTratamientoSeleccionada(consulta)
    setTratamientoSeleccionado(tratamiento)
    setModoTratamiento("editar")
    setOpenDetalleHistorial(false)
    setOpenTratamientoDialog(true)
  }

  const handleAgregarVacuna = (consulta: ConsultaClinica) => {
    setConsultaVacunaSeleccionada(consulta)
    setVacunaSeleccionada(null)
    setModoVacuna("crear")
    setOpenDetalleHistorial(false)
    setOpenVacunaDialog(true)
  }

  const handleEditarVacuna = (
    consulta: ConsultaClinica,
    vacuna: VacunaAplicada
  ) => {
    setConsultaVacunaSeleccionada(consulta)
    setVacunaSeleccionada(vacuna)
    setModoVacuna("editar")
    setOpenDetalleHistorial(false)
    setOpenVacunaDialog(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="h-10 w-72 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="h-36 animate-pulse rounded-3xl bg-gray-200" />
          <div className="h-36 animate-pulse rounded-3xl bg-gray-200" />
          <div className="h-36 animate-pulse rounded-3xl bg-gray-200" />
        </div>
        <div className="h-96 animate-pulse rounded-3xl bg-gray-200" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <section className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-orange-500 md:text-5xl">
            Gestionar Historia Clínica
          </h1>
          <p className="text-base text-slate-700 md:text-xl">
            Administra los historiales clínicos y consultas registradas
          </p>
        </section>

        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-600 shadow-sm">
          <p className="text-lg font-semibold">
            No se pudieron cargar los historiales clínicos.
          </p>
          <p className="mt-2 text-sm">
            Revisa que el backend esté levantado y que la ruta
            <span className="font-medium"> /api/gestion/clinica/historiales/ </span>
            responda correctamente.
          </p>

          <Button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-2xl bg-red-600 text-white hover:bg-red-700"
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-orange-500 md:text-5xl">
            Gestionar Historia Clínica
          </h1>
          <p className="text-base text-slate-700 md:text-xl">
            Administra los historiales clínicos y consultas registradas
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setOpenNuevoHistorial(true)}
          className="h-14 rounded-2xl bg-orange-500 px-6 text-lg font-semibold text-white hover:bg-orange-600"
        >
          + Nuevo historial
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-3xl border border-orange-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <p className="text-lg text-slate-800">Total historiales</p>
            <p className="mt-4 text-4xl font-extrabold text-violet-600 md:text-6xl">
              {stats.total}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-orange-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <p className="text-lg text-slate-800">Historiales activos</p>
            <p className="mt-4 text-4xl font-extrabold text-orange-500 md:text-6xl">
              {stats.activos}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-orange-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <p className="text-lg text-slate-800">Consultas registradas</p>
            <p className="mt-4 text-4xl font-extrabold text-violet-600 md:text-6xl">
              {stats.totalConsultas}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Input
          placeholder="Buscar por mascota, especie, raza, propietario u observaciones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-14 rounded-2xl border-2 border-violet-500 px-4 text-base text-violet-700 placeholder:text-violet-400"
        />

        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="h-14 rounded-2xl border-2 border-violet-500 bg-white px-4 text-base text-violet-700 outline-none"
        >
          <option value="todos">Todos</option>
          <option value="con_consultas">Con consultas</option>
          <option value="sin_consultas">Sin consultas</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
      </section>

      <p className="text-lg text-slate-800">
        Mostrando {filteredHistoriales.length} de {historiales.length} historiales
      </p>

      <section className="hidden xl:block">
        <div className="overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-violet-700 text-white">
                <tr>
                  <th className="w-[10%] px-3 py-4 text-left text-sm font-bold">
                    Mascota
                  </th>
                  <th className="w-[12%] px-3 py-4 text-left text-sm font-bold">
                    Especie / Raza
                  </th>
                  <th className="w-[13%] px-3 py-4 text-left text-sm font-bold">
                    Propietario
                  </th>
                  <th className="w-[18%] px-3 py-4 text-left text-sm font-bold">
                    Observaciones
                  </th>
                  <th className="w-[8%] px-3 py-4 text-left text-sm font-bold">
                    Consultas
                  </th>
                  <th className="w-[14%] px-3 py-4 text-left text-sm font-bold">
                    Última consulta
                  </th>
                  <th className="w-[9%] px-3 py-4 text-left text-sm font-bold">
                    Estado
                  </th>
                  <th className="w-[16%] px-3 py-4 text-left text-sm font-bold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredHistoriales.map((item) => {
                  const totalConsultas = item.consultas_clinicas?.length || 0
                  const ultimaConsulta =
                    totalConsultas > 0
                      ? item.consultas_clinicas?.[totalConsultas - 1]?.fecha_consulta
                      : undefined

                  return (
                    <tr
                      key={item.id_historial_clinico}
                      className="border-b border-slate-100 align-top"
                    >
                      <td className="px-3 py-4 text-sm font-semibold text-slate-900">
                        {item.mascota_nombre}
                      </td>

                      <td className="px-3 py-4 text-sm text-slate-700">
                        <div className="flex flex-col gap-1">
                          <span className="w-fit rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs text-sky-700">
                            {item.mascota_especie || "Sin especie"}
                          </span>
                          <span className="text-xs text-slate-500">
                            {item.mascota_raza || "Sin raza"}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-4 text-sm text-slate-700">
                        <p className="break-words">
                          {item.propietario_nombre || "Sin propietario"}
                        </p>
                      </td>

                      <td className="px-3 py-4 text-sm text-slate-700">
                        <p className="line-clamp-2 break-words">
                          {item.observaciones_generales || "Sin observaciones"}
                        </p>
                      </td>

                      <td className="px-3 py-4 text-sm text-slate-700">
                        {totalConsultas}
                      </td>

                      <td className="px-3 py-4 text-sm text-slate-700">
                        {formatearFecha(ultimaConsulta)}
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            item.estado
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {item.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-9 rounded-xl border-violet-300 px-3 text-xs text-violet-700 hover:bg-violet-50"
                            onClick={() => handleVerDetalle(item)}
                          >
                            Ver detalle
                          </Button>

                          <Button
                            type="button"
                            className="h-9 rounded-xl bg-orange-500 px-3 text-xs text-white hover:bg-orange-600"
                            onClick={() => handleNuevaConsulta(item)}
                          >
                            Nueva consulta
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {filteredHistoriales.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                      No se encontraron historiales clínicos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:hidden">
        {filteredHistoriales.map((item) => {
          const totalConsultas = item.consultas_clinicas?.length || 0
          const ultimaConsulta =
            totalConsultas > 0
              ? item.consultas_clinicas?.[totalConsultas - 1]?.fecha_consulta
              : undefined

          return (
            <Card
              key={item.id_historial_clinico}
              className="rounded-3xl border border-orange-200 bg-white shadow-sm"
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      {item.mascota_nombre}
                    </h3>
                    <p className="text-slate-600">
                      {item.propietario_nombre || "Sin propietario"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-1 text-sm font-medium ${
                      item.estado
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {item.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm text-sky-700">
                    {item.mascota_especie || "Sin especie"}
                  </span>

                  <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm text-violet-700">
                    {item.mascota_raza || "Sin raza"}
                  </span>

                  <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm text-orange-700">
                    Consultas: {totalConsultas}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-violet-600">
                      Observaciones
                    </p>
                    <p className="mt-1 text-slate-800">
                      {item.observaciones_generales || "Sin observaciones"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-violet-600">
                      Última consulta
                    </p>
                    <p className="mt-1 text-slate-800">
                      {formatearFecha(ultimaConsulta)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-xl border-violet-300 text-violet-700 hover:bg-violet-50"
                    onClick={() => handleVerDetalle(item)}
                  >
                    Ver detalle
                  </Button>

                  <Button
                    type="button"
                    className="w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                    onClick={() => handleNuevaConsulta(item)}
                  >
                    Nueva consulta
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredHistoriales.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No se encontraron historiales clínicos.
          </div>
        )}
      </section>

      <NuevoHistorialClinicoDialog
        open={openNuevoHistorial}
        onOpenChange={setOpenNuevoHistorial}
        mascotas={mascotasAdaptadas}
        propietarios={propietariosAdaptados}
        loading={isCreatingHistory}
        onSubmit={async (payload) => {
          await createClinicalHistory(payload).unwrap()
          setOpenNuevoHistorial(false)
        }}
      />

          <NuevaConsultaDialog
          open={openNuevaConsulta}
            onOpenChange={setOpenNuevaConsulta}
             idHistorialClinico={historialSeleccionado?.id_historial_clinico ?? null}
             nombreMascota={historialSeleccionado?.mascota_nombre ?? undefined}
       />

        <NuevaConsultaDialog
         open={openEditarConsulta}
          onOpenChange={setOpenEditarConsulta}
         idHistorialClinico={historialSeleccionado?.id_historial_clinico ?? null}
         nombreMascota={historialSeleccionado?.mascota_nombre ?? undefined}
          modo="editar"
           consultaInicial={consultaSeleccionada}
        />

      <EditarHistorialClinicoDialog
        open={openEditarHistorial}
        onOpenChange={setOpenEditarHistorial}
        historial={historialSeleccionado}
      />

      <TratamientoDialog
        open={openTratamientoDialog}
        onOpenChange={setOpenTratamientoDialog}
        consulta={consultaTratamientoSeleccionada}
        modo={modoTratamiento}
        tratamientoInicial={tratamientoSeleccionado}
      />

      <VacunaAplicadaDialog
        open={openVacunaDialog}
        onOpenChange={setOpenVacunaDialog}
        consulta={consultaVacunaSeleccionada}
        modo={modoVacuna}
        vacunaInicial={vacunaSeleccionada}
      />

      <HistorialClinicoDetailDialog
        open={openDetalleHistorial}
        onOpenChange={setOpenDetalleHistorial}
        historial={historialSeleccionado}
        onEditarConsulta={handleEditarConsulta}
        onEditarHistorial={handleEditarHistorial}
        onAgregarTratamiento={handleAgregarTratamiento}
        onEditarTratamiento={handleEditarTratamiento}
        onAgregarVacuna={handleAgregarVacuna}
        onEditarVacuna={handleEditarVacuna}
        onVerDetalleConsulta={handleVerDetalleConsulta}
      />

      <ConsultaClinicaDetailDialog
        open={openDetalleConsulta}
        onOpenChange={setOpenDetalleConsulta}
        consulta={consultaSeleccionada}
      />
    </div>
  )
}