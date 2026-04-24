import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  FileImage,
  FileArchive,
  File,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react"

import type {
  ConsultaClinica,
  Tratamiento,
  VacunaAplicada,
  Receta,
  DetalleReceta,
  ArchivoClinico,
} from "../store"

import { TratamientoDialog } from "./TratamientoDialog"
import { VacunaAplicadaDialog } from "./VacunaAplicadaDialog"
import { RecetaDialog } from "./RecetaDialog"
import { DetalleRecetaDialog } from "./DetalleRecetaDialog"
import { ArchivoClinicoDialog } from "./ArchivoClinicoDialog"
import { useUpdateArchivoClinicoMutation } from "../store"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  consulta: ConsultaClinica | null
}

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

function valorTexto(valor?: string | number | null, sufijo = "") {
  if (valor === null || valor === undefined || valor === "") return "—"
  return `${valor}${sufijo}`
}

function formatBytes(bytes?: number | null) {
  if (!bytes) return "No registrado"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getArchivoIcon(tipo?: string | null) {
  switch (tipo) {
    case "PDF":
      return <FileText className="h-5 w-5" />
    case "IMAGEN":
      return <FileImage className="h-5 w-5" />
    case "WORD":
      return <FileArchive className="h-5 w-5" />
    default:
      return <File className="h-5 w-5" />
  }
}

function getArchivoBadgeClass(tipo?: string | null) {
  switch (tipo) {
    case "PDF":
      return "bg-red-100 text-red-700"
    case "IMAGEN":
      return "bg-emerald-100 text-emerald-700"
    case "WORD":
      return "bg-blue-100 text-blue-700"
    default:
      return "bg-slate-200 text-slate-700"
  }
}

function isImageFile(archivo?: ArchivoClinico | null) {
  if (!archivo) return false
  if (archivo.tipo_archivo === "IMAGEN") return true
  const ext = archivo.extension?.toLowerCase()
  return ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext || "")
}

export function ConsultaClinicaDetailDialog({
  open,
  onOpenChange,
  consulta,
}: Props) {
  const [openTratamientoDialog, setOpenTratamientoDialog] = useState(false)
  const [modoTratamiento, setModoTratamiento] = useState<"crear" | "editar">(
    "crear"
  )
  const [tratamientoSeleccionado, setTratamientoSeleccionado] =
    useState<Tratamiento | null>(null)

  const [openVacunaDialog, setOpenVacunaDialog] = useState(false)
  const [modoVacuna, setModoVacuna] = useState<"crear" | "editar">("crear")
  const [vacunaSeleccionada, setVacunaSeleccionada] =
    useState<VacunaAplicada | null>(null)

  const [openRecetaDialog, setOpenRecetaDialog] = useState(false)
  const [modoReceta, setModoReceta] = useState<"crear" | "editar">("crear")
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(
    null
  )

  const [openDetalleRecetaDialog, setOpenDetalleRecetaDialog] = useState(false)
  const [modoDetalleReceta, setModoDetalleReceta] = useState<
    "crear" | "editar"
  >("crear")
  const [detalleRecetaSeleccionado, setDetalleRecetaSeleccionado] =
    useState<DetalleReceta | null>(null)

  const [openArchivoDialog, setOpenArchivoDialog] = useState(false)
  const [modoArchivo, setModoArchivo] = useState<"crear" | "editar">("crear")
  const [archivoSeleccionado, setArchivoSeleccionado] =
    useState<ArchivoClinico | null>(null)

  const [updateArchivoClinico, { isLoading: isUpdatingArchivo }] =
    useUpdateArchivoClinicoMutation()

  if (!consulta) return null

  const tratamientos = consulta.tratamientos ?? []
  const receta = consulta.receta ?? null
  const detallesReceta = receta?.detalles ?? []
  const vacunas = consulta.vacunas_aplicadas ?? []
  const archivos = consulta.archivos_clinicos ?? []

  const handleNuevoTratamiento = () => {
    setTratamientoSeleccionado(null)
    setModoTratamiento("crear")
    setOpenTratamientoDialog(true)
  }

  const handleEditarTratamiento = (tratamiento: Tratamiento) => {
    setTratamientoSeleccionado(tratamiento)
    setModoTratamiento("editar")
    setOpenTratamientoDialog(true)
  }

  const handleNuevaVacuna = () => {
    setVacunaSeleccionada(null)
    setModoVacuna("crear")
    setOpenVacunaDialog(true)
  }

  const handleEditarVacuna = (vacuna: VacunaAplicada) => {
    setVacunaSeleccionada(vacuna)
    setModoVacuna("editar")
    setOpenVacunaDialog(true)
  }

  const handleNuevaReceta = () => {
    setRecetaSeleccionada(null)
    setModoReceta("crear")
    setOpenRecetaDialog(true)
  }

  const handleEditarReceta = (recetaActual: Receta) => {
    setRecetaSeleccionada(recetaActual)
    setModoReceta("editar")
    setOpenRecetaDialog(true)
  }

  const handleNuevoDetalleReceta = () => {
    if (!receta) return
    setDetalleRecetaSeleccionado(null)
    setModoDetalleReceta("crear")
    setOpenDetalleRecetaDialog(true)
  }

  const handleEditarDetalleReceta = (detalle: DetalleReceta) => {
    if (!receta) return
    setDetalleRecetaSeleccionado(detalle)
    setModoDetalleReceta("editar")
    setOpenDetalleRecetaDialog(true)
  }

  const handleNuevoArchivo = () => {
    setArchivoSeleccionado(null)
    setModoArchivo("crear")
    setOpenArchivoDialog(true)
  }

  const handleEditarArchivo = (archivo: ArchivoClinico) => {
    setArchivoSeleccionado(archivo)
    setModoArchivo("editar")
    setOpenArchivoDialog(true)
  }

  const handleDesactivarArchivo = async (archivo: ArchivoClinico) => {
    if (!archivo.id_archivo_clinico) return

    const confirmado = window.confirm(
      `¿Deseas desactivar el archivo "${archivo.nombre_archivo || "archivo"}"?`
    )
    if (!confirmado) return

    try {
      await updateArchivoClinico({
        idArchivoClinico: archivo.id_archivo_clinico,
        body: {
          estado: false,
          consulta_clinica:
            archivo.consulta_clinica ?? consulta.id_consulta_clinica,
          nombre_archivo: archivo.nombre_archivo ?? "",
          tipo_archivo: archivo.tipo_archivo ?? "OTRO",
          descripcion: archivo.descripcion ?? "",
        },
      }).unwrap()
    } catch (error) {
      console.error(error)
      window.alert("No se pudo desactivar el archivo clínico.")
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!w-[96vw] !max-w-[96vw] sm:!max-w-[1100px] lg:!max-w-[1180px] !p-0 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl">
          <div className="flex max-h-[90vh] flex-col bg-white">
            <DialogHeader className="border-b border-slate-200 bg-white px-6 py-6 md:px-8">
              <DialogTitle className="text-left text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Detalle de consulta clínica
              </DialogTitle>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
                Revisa la información clínica registrada, tratamientos, receta,
                vacunas y archivos asociados.
              </p>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6 md:px-8 md:py-8">
              <div className="space-y-6">
                <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <CardContent className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                        Mascota
                      </p>
                      <p className="mt-2 text-2xl font-extrabold text-slate-900">
                        {consulta.mascota_nombre || "Sin mascota"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                        Propietario
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {consulta.propietario_nombre || "Sin propietario"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                        Veterinario
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {consulta.veterinario_nombre || "Sin veterinario"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                        Fecha de consulta
                      </p>
                      <p className="mt-2 text-base font-semibold text-slate-900">
                        {formatearFecha(consulta.fecha_consulta)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
                        Motivo de consulta
                      </p>
                      <p className="mt-3 text-base leading-7 text-slate-700">
                        {consulta.motivo_consulta || "Sin motivo"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
                        Diagnóstico
                      </p>
                      <p className="mt-3 text-base leading-7 text-slate-700">
                        {consulta.diagnostico || "Sin diagnóstico"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm md:col-span-2">
                    <CardContent className="p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
                        Observaciones
                      </p>
                      <p className="mt-3 text-base leading-7 text-slate-700">
                        {consulta.observaciones || "Sin observaciones"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-900">
                      Datos clínicos
                    </h3>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          Peso
                        </p>
                        <p className="mt-2 text-base font-semibold text-slate-900">
                          {valorTexto(consulta.peso, " kg")}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          Temperatura
                        </p>
                        <p className="mt-2 text-base font-semibold text-slate-900">
                          {valorTexto(consulta.temperatura, " °C")}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          F. cardiaca
                        </p>
                        <p className="mt-2 text-base font-semibold text-slate-900">
                          {valorTexto(consulta.frecuencia_cardiaca, " lpm")}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          F. respiratoria
                        </p>
                        <p className="mt-2 text-base font-semibold text-slate-900">
                          {valorTexto(consulta.frecuencia_respiratoria, " rpm")}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          Próxima revisión
                        </p>
                        <p className="mt-2 text-base font-semibold text-slate-900">
                          {consulta.proxima_revision
                            ? formatearFecha(consulta.proxima_revision)
                            : "No registrada"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-xl font-bold text-slate-900">
                        Tratamientos
                      </h3>
                      <Button
                        type="button"
                        onClick={handleNuevoTratamiento}
                        className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                      >
                        Agregar tratamiento
                      </Button>
                    </div>

                    {tratamientos.length === 0 ? (
                      <p className="mt-4 text-slate-500">
                        No hay tratamientos registrados.
                      </p>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {tratamientos.map((tratamiento) => (
                          <div
                            key={tratamiento.id_tratamiento}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900">
                                  {tratamiento.tipo || "Tratamiento"}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  {tratamiento.descripcion || "Sin descripción"}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Observación:{" "}
                                  {tratamiento.observacion || "Sin observación"}
                                </p>
                                <p className="mt-2 text-xs text-slate-500">
                                  Inicio: {formatearFecha(tratamiento.fecha_ini)} | Fin:{" "}
                                  {formatearFecha(tratamiento.fecha_fin)}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Estado:{" "}
                                  {tratamiento.estado_tratamiento || "Sin estado"}
                                </p>
                              </div>

                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                                onClick={() => handleEditarTratamiento(tratamiento)}
                              >
                                Editar tratamiento
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-xl font-bold text-slate-900">
                        Vacunas aplicadas
                      </h3>
                      <Button
                        type="button"
                        onClick={handleNuevaVacuna}
                        className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                      >
                        Agregar vacuna
                      </Button>
                    </div>

                    {vacunas.length === 0 ? (
                      <p className="mt-4 text-slate-500">
                        No hay vacunas registradas.
                      </p>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {vacunas.map((vacuna) => (
                          <div
                            key={vacuna.id_vacuna_aplicada}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900">
                                  {vacuna.nombre_vacuna || "Vacuna"}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Dosis: {vacuna.dosis || "Sin dosis"}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Fecha aplicada: {formatearFecha(vacuna.fecha_aplicada)}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Próxima fecha: {formatearFecha(vacuna.fecha_proxima)}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Lote: {vacuna.lote || "Sin lote"}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Fabricante: {vacuna.fabricante || "Sin fabricante"}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Observación: {vacuna.observacion || "Sin observación"}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Estado vacuna: {vacuna.estado_vacuna || "Sin estado"}
                                </p>
                              </div>

                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                                onClick={() => handleEditarVacuna(vacuna)}
                              >
                                Editar vacuna
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-xl font-bold text-slate-900">Receta</h3>

                      {!receta ? (
                        <Button
                          type="button"
                          onClick={handleNuevaReceta}
                          className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                        >
                          Crear receta
                        </Button>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            onClick={handleNuevoDetalleReceta}
                            className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                          >
                            Agregar detalle
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleEditarReceta(receta)}
                            className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                          >
                            Editar receta
                          </Button>
                        </div>
                      )}
                    </div>

                    {!receta ? (
                      <p className="mt-4 text-slate-500">
                        No hay receta registrada.
                      </p>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="font-semibold text-slate-900">
                            Fecha: {formatearFecha(receta.fecha)}
                          </p>
                          <p className="mt-2 font-semibold text-slate-900">
                            Indicaciones: {receta.indicaciones || "Sin indicaciones"}
                          </p>
                          <p className="mt-2 text-sm text-slate-700">
                            Observación: {receta.observacion || "Sin observación"}
                          </p>
                        </div>

                        {detallesReceta.length === 0 ? (
                          <p className="text-slate-500">
                            No hay detalles de receta.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {detallesReceta.map((detalle) => (
                              <div
                                key={detalle.id_detalle_receta}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                              >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="flex-1">
                                    <p className="font-semibold text-slate-900">
                                      {detalle.medicamento || "Medicamento"}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-700">
                                      Dosis: {detalle.dosis || "—"}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-700">
                                      Frecuencia: {detalle.frecuencia || "—"}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-700">
                                      Duración: {detalle.duracion_dias ?? "—"} días
                                    </p>
                                    <p className="mt-1 text-sm text-slate-700">
                                      Indicaciones adicionales:{" "}
                                      {detalle.indicaciones_adicionales || "—"}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                      Producto asociado: {detalle.id_producto ?? "Sin producto"}
                                    </p>
                                  </div>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                                    onClick={() => handleEditarDetalleReceta(detalle)}
                                  >
                                    Editar detalle
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-xl font-bold text-slate-900">
                        Archivos clínicos
                      </h3>
                      <Button
                        type="button"
                        onClick={handleNuevoArchivo}
                        className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                      >
                        Agregar archivo
                      </Button>
                    </div>

                    {archivos.length === 0 ? (
                      <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                        <p className="text-base font-semibold text-slate-700">
                          No hay archivos clínicos registrados
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Adjunta imágenes, PDF, Word u otros archivos para esta consulta.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        {archivos.map((archivo) => (
                          <div
                            key={archivo.id_archivo_clinico}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div className="flex flex-1 gap-4">
                                <div className="mt-1 rounded-xl bg-white p-3 text-slate-700 shadow-sm">
                                  {getArchivoIcon(archivo.tipo_archivo)}
                                </div>

                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-base font-semibold text-slate-900">
                                      {archivo.nombre_archivo || "Archivo"}
                                    </p>

                                    <span
                                      className={`rounded-full px-3 py-1 text-xs font-medium ${getArchivoBadgeClass(
                                        archivo.tipo_archivo
                                      )}`}
                                    >
                                      {archivo.tipo_archivo || "OTRO"}
                                    </span>

                                    <span
                                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        archivo.estado
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-slate-200 text-slate-600"
                                      }`}
                                    >
                                      {archivo.estado ? "Activo" : "Inactivo"}
                                    </span>
                                  </div>

                                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    <p className="text-sm text-slate-700">
                                      <span className="font-medium text-slate-900">
                                        Extensión:
                                      </span>{" "}
                                      {archivo.extension || "No registrada"}
                                    </p>
                                    <p className="text-sm text-slate-700">
                                      <span className="font-medium text-slate-900">
                                        Tamaño:
                                      </span>{" "}
                                      {formatBytes(archivo.tamano_bytes)}
                                    </p>
                                    <p className="text-sm text-slate-700">
                                      <span className="font-medium text-slate-900">
                                        Fecha subida:
                                      </span>{" "}
                                      {formatearFecha(archivo.fecha_subida)}
                                    </p>
                                    <p className="text-sm text-slate-700">
                                      <span className="font-medium text-slate-900">
                                        Descripción:
                                      </span>{" "}
                                      {archivo.descripcion || "Sin descripción"}
                                    </p>
                                  </div>

                                  {isImageFile(archivo) && archivo.archivo && (
                                    <div className="mt-4">
                                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-violet-600">
                                        Vista previa
                                      </p>
                                      <img
                                        src={archivo.archivo}
                                        alt={archivo.nombre_archivo || "Vista previa"}
                                        className="max-h-52 rounded-2xl border border-slate-200 object-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 md:w-[180px]">
                                {archivo.archivo && (
                                  <a
                                    href={archivo.archivo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-300 px-4 py-2 text-sm text-violet-700 hover:bg-violet-50"
                                  >
                                    <Eye className="h-4 w-4" />
                                    Ver archivo
                                  </a>
                                )}

                                <Button
                                  type="button"
                                  variant="outline"
                                  className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                                  onClick={() => handleEditarArchivo(archivo)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar archivo
                                </Button>

                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={isUpdatingArchivo || !archivo.estado}
                                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleDesactivarArchivo(archivo)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {archivo.estado ? "Desactivar" : "Desactivado"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white px-6 py-5 md:px-8">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                  onClick={() => onOpenChange(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TratamientoDialog
        open={openTratamientoDialog}
        onOpenChange={setOpenTratamientoDialog}
        idConsultaClinica={consulta.id_consulta_clinica}
        modo={modoTratamiento}
        tratamientoInicial={tratamientoSeleccionado}
      />

      <VacunaAplicadaDialog
        open={openVacunaDialog}
        onOpenChange={setOpenVacunaDialog}
        idConsultaClinica={consulta.id_consulta_clinica}
        modo={modoVacuna}
        vacunaInicial={vacunaSeleccionada}
      />

      <RecetaDialog
        open={openRecetaDialog}
        onOpenChange={setOpenRecetaDialog}
        idConsultaClinica={consulta.id_consulta_clinica}
        modo={modoReceta}
        recetaInicial={recetaSeleccionada}
      />

      <DetalleRecetaDialog
        open={openDetalleRecetaDialog}
        onOpenChange={setOpenDetalleRecetaDialog}
        receta={receta}
        idReceta={receta?.id_receta ?? null}
        modo={modoDetalleReceta}
        detalleInicial={detalleRecetaSeleccionado}
      />

      <ArchivoClinicoDialog
        open={openArchivoDialog}
        onOpenChange={setOpenArchivoDialog}
        consulta={consulta}
        modo={modoArchivo}
        archivoInicial={archivoSeleccionado}
      />
    </>
  )
}