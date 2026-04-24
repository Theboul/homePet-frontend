import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type {
  ClinicalHistory,
  ConsultaClinica,
  Tratamiento,
  VacunaAplicada,
} from "../store"

interface HistorialClinicoDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  historial: ClinicalHistory | null
  onEditarConsulta?: (consulta: ConsultaClinica) => void
  onEditarHistorial?: () => void
  onAgregarTratamiento?: (consulta: ConsultaClinica) => void
  onEditarTratamiento?: (
    consulta: ConsultaClinica,
    tratamiento: Tratamiento
  ) => void
  onAgregarVacuna?: (consulta: ConsultaClinica) => void
  onEditarVacuna?: (
    consulta: ConsultaClinica,
    vacuna: VacunaAplicada
  ) => void
  onVerDetalleConsulta?: (consulta: ConsultaClinica) => void
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
  if (valor === null || valor === undefined || valor === "") {
    return "No registrado"
  }
  return `${valor}${sufijo}`
}

export function HistorialClinicoDetailDialog({
  open,
  onOpenChange,
  historial,
  onEditarConsulta,
  onEditarHistorial,
  onAgregarTratamiento,
  onEditarTratamiento,
  onAgregarVacuna,
  onEditarVacuna,
  onVerDetalleConsulta,
}: HistorialClinicoDetailDialogProps) {
  const consultasOrdenadas = useMemo(() => {
    if (!historial?.consultas_clinicas) return []

    return [...historial.consultas_clinicas].sort((a, b) => {
      const fechaA = new Date(a.fecha_consulta || "").getTime()
      const fechaB = new Date(b.fecha_consulta || "").getTime()
      return fechaA - fechaB
    })
  }, [historial])

  if (!historial) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[96vw] !max-w-[96vw] sm:!max-w-[1200px] lg:!max-w-[1240px] !p-0 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex max-h-[90vh] flex-col bg-white">
          <DialogHeader className="border-b border-slate-200 bg-white px-6 py-6 md:px-8">
            <DialogTitle className="text-left text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Detalle del historial clínico
            </DialogTitle>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
              Revisa la información general del historial y las consultas clínicas
              registradas.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6 md:px-8 md:py-8">
            <div className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Mascota
                    </p>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900">
                      {historial.mascota_nombre || "Sin nombre"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Especie / Raza
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {historial.mascota_especie || "Sin especie"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {historial.mascota_raza || "Sin raza"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Propietario
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {historial.propietario_nombre || "Sin propietario"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Estado
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${
                          historial.estado
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {historial.estado ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                      Observaciones generales
                    </p>
                    <p className="mt-3 text-base leading-7 text-slate-700">
                      {historial.observaciones_generales ||
                        "Sin observaciones generales."}
                    </p>
                  </div>

                  {onEditarHistorial && (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                      onClick={onEditarHistorial}
                    >
                      Editar historial
                    </Button>
                  )}
                </div>
              </section>

              <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
                    Consultas clínicas
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Historial cronológico de atenciones registradas.
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                  {consultasOrdenadas.length}{" "}
                  {consultasOrdenadas.length === 1 ? "consulta" : "consultas"}
                </span>
              </section>

              {consultasOrdenadas.length > 0 ? (
                <div className="space-y-5">
                  {consultasOrdenadas.map((consulta, index) => (
                    <article
                      key={consulta.id_consulta_clinica}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h4 className="text-2xl font-extrabold text-slate-900">
                            Consulta #{index + 1}
                          </h4>
                          <p className="mt-2 text-base text-slate-600">
                            {formatearFecha(consulta.fecha_consulta)}
                          </p>
                        </div>

                        <div className="flex flex-col items-start gap-3 md:items-end">
                          <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
                            {consulta.veterinario_nombre || "Sin veterinario"}
                          </span>

                          <div className="flex flex-wrap gap-2">
                            {onVerDetalleConsulta && (
                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-xl border-violet-300 text-violet-700 hover:bg-violet-50"
                                onClick={() => onVerDetalleConsulta(consulta)}
                              >
                                Ver detalle completo
                              </Button>
                            )}

                            {onEditarConsulta && (
                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                                onClick={() => onEditarConsulta(consulta)}
                              >
                                Editar consulta
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
                            Motivo de consulta
                          </p>
                          <p className="mt-2 text-base leading-7 text-slate-700">
                            {consulta.motivo_consulta || "No registrado"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
                            Diagnóstico
                          </p>
                          <p className="mt-2 text-base leading-7 text-slate-700">
                            {consulta.diagnostico || "No registrado"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
                            Observaciones
                          </p>
                          <p className="mt-2 text-base leading-7 text-slate-700">
                            {consulta.observaciones || "Sin observaciones"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h5 className="text-lg font-bold text-slate-900">
                          Datos clínicos
                        </h5>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                              Peso
                            </p>
                            <p className="mt-2 text-base font-semibold text-slate-900">
                              {valorTexto(consulta.peso, " kg")}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                              Temperatura
                            </p>
                            <p className="mt-2 text-base font-semibold text-slate-900">
                              {valorTexto(consulta.temperatura, " °C")}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                              F. cardiaca
                            </p>
                            <p className="mt-2 text-base font-semibold text-slate-900">
                              {valorTexto(consulta.frecuencia_cardiaca, " lpm")}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                              F. respiratoria
                            </p>
                            <p className="mt-2 text-base font-semibold text-slate-900">
                              {valorTexto(consulta.frecuencia_respiratoria, " rpm")}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
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
                      </div>

                      <div className="mt-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h5 className="text-lg font-bold text-slate-900">
                            Tratamientos
                          </h5>

                          {onAgregarTratamiento && (
                            <Button
                              type="button"
                              className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                              onClick={() => onAgregarTratamiento(consulta)}
                            >
                              Agregar tratamiento
                            </Button>
                          )}
                        </div>

                        {consulta.tratamientos && consulta.tratamientos.length > 0 ? (
                          <div className="mt-4 space-y-3">
                            {consulta.tratamientos.map((tratamiento) => (
                              <div
                                key={tratamiento.id_tratamiento}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                              >
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

                                {onEditarTratamiento && (
                                  <div className="mt-3 flex justify-end">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                                      onClick={() =>
                                        onEditarTratamiento(consulta, tratamiento)
                                      }
                                    >
                                      Editar tratamiento
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-slate-500">
                            No hay tratamientos registrados.
                          </p>
                        )}
                      </div>

                      <div className="mt-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h5 className="text-lg font-bold text-slate-900">
                            Vacunas aplicadas
                          </h5>

                          {onAgregarVacuna && (
                            <Button
                              type="button"
                              className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                              onClick={() => onAgregarVacuna(consulta)}
                            >
                              Agregar vacuna
                            </Button>
                          )}
                        </div>

                        {consulta.vacunas_aplicadas &&
                        consulta.vacunas_aplicadas.length > 0 ? (
                          <div className="mt-4 space-y-3">
                            {consulta.vacunas_aplicadas.map((vacuna) => (
                              <div
                                key={vacuna.id_vacuna_aplicada}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                              >
                                <p className="font-semibold text-slate-900">
                                  {vacuna.nombre_vacuna || "Vacuna"}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Dosis: {vacuna.dosis || "Sin dosis"}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Fecha aplicada:{" "}
                                  {formatearFecha(vacuna.fecha_aplicada)}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Próxima fecha:{" "}
                                  {formatearFecha(vacuna.fecha_proxima)}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Lote: {vacuna.lote || "Sin lote"}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Fabricante:{" "}
                                  {vacuna.fabricante || "Sin fabricante"}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                  Observación:{" "}
                                  {vacuna.observacion || "Sin observación"}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Estado vacuna:{" "}
                                  {vacuna.estado_vacuna || "Sin estado"}
                                </p>

                                {onEditarVacuna && (
                                  <div className="mt-3 flex justify-end">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                                      onClick={() =>
                                        onEditarVacuna(consulta, vacuna)
                                      }
                                    >
                                      Editar vacuna
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-slate-500">
                            No hay vacunas registradas.
                          </p>
                        )}
                      </div>

                      <div className="mt-6">
                        <h5 className="text-lg font-bold text-slate-900">
                          Receta
                        </h5>

                        {consulta.receta ? (
                          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm text-slate-700">
                              {consulta.receta.indicaciones || "Sin indicaciones"}
                            </p>

                            {consulta.receta.observacion && (
                              <p className="mt-2 text-sm text-slate-600">
                                Observación: {consulta.receta.observacion}
                              </p>
                            )}

                            {consulta.receta.detalles &&
                              consulta.receta.detalles.length > 0 && (
                                <div className="mt-4 space-y-3">
                                  {consulta.receta.detalles.map((detalle) => (
                                    <div
                                      key={detalle.id_detalle_receta}
                                      className="rounded-xl border border-slate-200 bg-white p-3"
                                    >
                                      <p className="font-medium text-slate-900">
                                        {detalle.medicamento || "Medicamento"}
                                      </p>
                                      <p className="mt-1 text-sm text-slate-600">
                                        Dosis: {detalle.dosis || "No registrada"}
                                      </p>
                                      <p className="text-sm text-slate-600">
                                        Frecuencia:{" "}
                                        {detalle.frecuencia || "No registrada"}
                                      </p>
                                      <p className="text-sm text-slate-600">
                                        Duración: {detalle.duracion_dias ?? "—"} días
                                      </p>
                                      <p className="text-sm text-slate-600">
                                        Indicaciones adicionales:{" "}
                                        {detalle.indicaciones_adicionales || "—"}
                                      </p>
                                      <p className="text-sm text-slate-500">
                                        Producto asociado:{" "}
                                        {detalle.id_producto ?? "Sin producto"}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-slate-500">
                            No hay receta registrada.
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                  <p className="text-lg font-semibold text-slate-700">
                    No hay consultas clínicas registradas
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Cuando agregues consultas, se mostrarán aquí.
                  </p>
                </div>
              )}
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
  )
}