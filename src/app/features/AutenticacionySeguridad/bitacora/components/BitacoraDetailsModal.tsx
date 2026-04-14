import type { Bitacora } from '../store/bitacora.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#/components/ui/dialog';

interface BitacoraDetailsModalProps {
  bitacora: Bitacora | null;
  onClose: () => void;
}

export function BitacoraDetailsModal({ bitacora, onClose }: BitacoraDetailsModalProps) {
  // Si no hay bitácora seleccionada, no renderizamos el contenido interno para evitar errores
  if (!bitacora) return null;

  return (
    <Dialog 
      open={!!bitacora} 
      onOpenChange={(isOpen) => !isOpen && onClose()}
    >
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#7C3AED]">
            Detalle del Evento #{bitacora.id_bitacora}
          </DialogTitle>
          <DialogDescription>
            Información técnica, sistema de origen y metadatos del evento registrado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          
          {/* Información Básica */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-500">Acción:</span>
              <p className="font-medium text-gray-900">{bitacora.accion_display}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-500">Entidad Afectada:</span>
              <p className="font-medium text-gray-900">
                {bitacora.entidad_tipo || 'N/A'} 
                {bitacora.entidad_id ? ` (#${bitacora.entidad_id})` : ''}
              </p>
            </div>
            <div className="col-span-2">
              <span className="font-semibold text-gray-500">Descripción:</span>
              <p className="font-medium text-gray-900">{bitacora.descripcion}</p>
            </div>
          </div>

          {/* Datos Técnicos (Navegador) */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="font-semibold text-gray-500 text-sm block mb-1">
              User Agent (Navegador/Dispositivo):
            </span>
            <p className="font-mono text-xs text-gray-700 break-words">
              {bitacora.user_agent || 'Desconocido'}
            </p>
          </div>

          {/* El JSON Mágico de Metadatos */}
          <div>
            <span className="font-semibold text-gray-500 text-sm block mb-2">
              Metadatos (Valores Anteriores/Nuevos):
            </span>
            <div className="bg-slate-900 p-4 rounded-xl overflow-x-auto shadow-inner">
              <pre className="font-mono text-xs text-green-400">
                <code>
                  {Object.keys(bitacora.metadatos || {}).length > 0 
                    ? JSON.stringify(bitacora.metadatos, null, 2) 
                    : '// No hay metadatos adicionales para este evento.'}
                </code>
              </pre>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}